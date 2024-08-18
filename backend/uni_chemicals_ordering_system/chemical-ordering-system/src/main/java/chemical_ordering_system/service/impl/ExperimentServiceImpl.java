package chemical_ordering_system.service.impl;

import chemical_ordering_system.model.ApiResponse;
import chemical_ordering_system.model.Chemical;
import chemical_ordering_system.model.Experiment;
import chemical_ordering_system.repository.ChemicalRepository;
import chemical_ordering_system.repository.ExperimentRepository;
import chemical_ordering_system.service.IExperimentService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.lang.reflect.Field;
import java.util.List;
import java.util.Map;

@Service
public class ExperimentServiceImpl implements IExperimentService {

    @Autowired private ExperimentRepository experimentRepository;
    @Autowired private ChemicalRepository chemicalRepository;

    @Override
    public ApiResponse<List<Experiment>> getAllExperiments() {
        List<Experiment> experiments = experimentRepository.findAll();
        return new ApiResponse<>(200, "Success", experiments);
    }

    @Override
    public ApiResponse<Experiment> getExperimentById(String id) {
        return experimentRepository
                .findById(id)
                .map(experiment -> new ApiResponse<>(200, "Success", experiment))
                .orElseGet(
                        () ->
                                new ApiResponse<>(
                                        404, "Experiment with ID " + id + " not found", null));
    }

    @Override
    public ApiResponse<Experiment> createExperiment(Map<String, Object> requestBody) {
        String name = (String) requestBody.get("name");
        String riskAssessment = (String) requestBody.get("riskAssessment");
        String chemicalId = (String) requestBody.get("chemicalId");
        Short amount = ((Integer) requestBody.get("amount")).shortValue();
        String unit = (String) requestBody.get("unit");

        if (name == null || chemicalId == null || amount == null || unit == null) {
            return new ApiResponse<>(400, "Missing required fields", null);
        }

        Experiment experiment = new Experiment();
        experiment.setName(name);
        experiment.setRiskAssessment(riskAssessment);
        experiment.setChemicalId(chemicalId);
        experiment.setAmount(amount);
        experiment.setUnit(unit);
        experiment.setStaffSubmitTime(System.currentTimeMillis());
        experiment.setStatus((short) 0);

        Experiment savedExperiment = experimentRepository.save(experiment);
        return new ApiResponse<>(200, "Success", savedExperiment);
    }

    @Override
    public ApiResponse<Experiment> updateExperiment(String id, Map<String, Object> requestBody) {
        Integer userType = (Integer) requestBody.get("userType");
        if (userType == null) {
            return new ApiResponse<>(400, "Please provide a valid userType", null);
        }

        if (!experimentRepository.existsById(id)) {
            return new ApiResponse<>(404, "Experiment with ID " + id + " not found", null);
        }

        Experiment originalExperiment = experimentRepository.findById(id).orElseThrow();

        switch (userType) {
            case 0: // Admin user: Can modify all fields
                requestBody.forEach(
                        (key, value) -> {
                            try {
                                Field field = Experiment.class.getDeclaredField(key);
                                field.setAccessible(true);
                                if (field.getType() == Short.class
                                        && value.getClass() == Integer.class) {
                                    field.set(originalExperiment, ((Integer) value).shortValue());
                                } else {
                                    field.set(originalExperiment, value);
                                }
                            } catch (NoSuchFieldException | IllegalAccessException e) {
                                // Skip fields that don't exist or cannot be accessed
                            }
                        });
                break;
            case 1: // Research staff: Not authorized to use this API
                return new ApiResponse<>(403, "You are not authorized to use this API", null);
            case 2: // Supervisor: Can only modify fields starting with supervisor_
                if (originalExperiment.getStatus() != 0) {
                    return new ApiResponse<>(
                            400, "Invalid status, please follow the approval steps", null);
                }
                Chemical chemical =
                        chemicalRepository
                                .findById(originalExperiment.getChemicalId())
                                .orElse(null);
                short riskCategory = chemical.getRiskCategory();
                Boolean supervisorApproveStatus =
                        (Boolean) requestBody.get("supervisorApproveStatus");
                if (supervisorApproveStatus != null) {
                    originalExperiment.setSupervisorApproveStatus(supervisorApproveStatus);
                    if (supervisorApproveStatus) {
                        originalExperiment.setSupervisorApproveTime(System.currentTimeMillis());
                        originalExperiment.setStatus(riskCategory > 0 ? (short) 1 : (short) 2);
                    } else {
                        if (requestBody.get("supervisorComment") != null) {
                            originalExperiment.setSupervisorComment(
                                    requestBody.get("supervisorComment").toString());
                        }
                    }
                }
                break;
            case 3: // Higher approver: Can only modify fields starting with higher_approve_
                if (originalExperiment.getStatus() != 1) {
                    return new ApiResponse<>(
                            400, "Invalid status, please follow the approval steps", null);
                }
                Boolean higherApproveStatus = (Boolean) requestBody.get("higherApproveStatus");
                if (higherApproveStatus != null) {
                    originalExperiment.setHigherApproveStatus(higherApproveStatus);
                    if (higherApproveStatus) {
                        originalExperiment.setHigherApproveTime(System.currentTimeMillis());
                        originalExperiment.setStatus((short) 2);
                    } else {
                        if (requestBody.get("higherApproveComment") != null) {
                            originalExperiment.setHigherApproveComment(
                                    requestBody.get("higherApproveComment").toString());
                        }
                    }
                }
                break;
            case 4: // Order manager: Can only modify fields starting with order_
                if (originalExperiment.getOrderApproveTime() == null) {
                    if (originalExperiment.getStatus() != 2) {
                        return new ApiResponse<>(
                                400, "Invalid status, please follow the approval steps", null);
                    }
                    Boolean orderApproveStatus = (Boolean) requestBody.get("orderApproveStatus");
                    if (orderApproveStatus == null) {
                        return new ApiResponse<>(
                                400,
                                "orderApproveStatus has not been approved yet, please provide it first",
                                null);
                    } else {
                        originalExperiment.setOrderApproveStatus(orderApproveStatus);
                        if (orderApproveStatus) {
                            originalExperiment.setOrderApproveTime(System.currentTimeMillis());
                            originalExperiment.setStatus((short) 3);
                        } else {
                            if (requestBody.get("orderComment") != null) {
                                originalExperiment.setOrderComment(
                                        requestBody.get("orderComment").toString());
                            }
                        }
                    }
                } else if (originalExperiment.getOrderApproveStatus()) {
                    if (originalExperiment.getOrderReceiveTime() == null) {
                        Long orderReceiveTime = (Long) requestBody.get("orderReceiveTime");
                        if (orderReceiveTime == null) {
                            return new ApiResponse<>(
                                    400,
                                    "The order has not been received, please provide orderReceiveTime first",
                                    null);
                        }
                        if (originalExperiment.getStatus() != 3) {
                            return new ApiResponse<>(
                                    400, "Invalid status, please follow the approval steps", null);
                        }
                        if (requestBody.get("orderReceiveTime") != null) {
                            originalExperiment.setOrderReceiveTime(orderReceiveTime);
                            originalExperiment.setStatus((short) 4);
                        }
                    } else if (originalExperiment.getOrderPlacedTime() == null) {
                        if (originalExperiment.getStatus() != 4) {
                            return new ApiResponse<>(
                                    400, "Invalid status, please follow the approval steps", null);
                        }
                        if (requestBody.get("orderPlacedTime") != null) {
                            originalExperiment.setOrderPlacedTime(
                                    (Long) requestBody.get("orderPlacedTime"));
                            originalExperiment.setStatus((short) 5);
                        }
                    }
                }
                break;
            default:
                return new ApiResponse<>(400, "Invalid userType", null);
        }

        experimentRepository.save(originalExperiment);
        return new ApiResponse<>(200, "Success", originalExperiment);
    }

    @Override
    public ApiResponse<Void> deleteExperiment(String id, Map<String, Object> requestBody) {
        Integer userType = (Integer) requestBody.get("userType");
        if (userType == null || userType != 0) {
            return new ApiResponse<>(403, "You are not authorized to delete this experiment", null);
        }

        if (!experimentRepository.existsById(id)) {
            return new ApiResponse<>(404, "Experiment with ID " + id + " not found", null);
        }

        experimentRepository.deleteById(id);
        return new ApiResponse<>(200, "Success", null);
    }
}
