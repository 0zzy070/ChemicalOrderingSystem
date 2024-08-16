package chemical_ordering_system.controller;

import chemical_ordering_system.model.ApiResponse;
import chemical_ordering_system.model.Chemical;
import chemical_ordering_system.model.Experiment;
import chemical_ordering_system.repository.ChemicalRepository;
import chemical_ordering_system.repository.ExperimentRepository;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.lang.reflect.Field;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/experiments")
public class ExperimentController {

    @Autowired private ExperimentRepository experimentRepository;
    @Autowired private ChemicalRepository chemicalRepository;

    /**
     * Get a list of all experiments.
     *
     * @return A response with a list of all experiments.
     */
    @GetMapping
    public ApiResponse<List<Experiment>> getAllExperiments() {
        List<Experiment> experiments = experimentRepository.findAll();
        return new ApiResponse<>(200, "Success", experiments);
    }

    /**
     * Get details of a specific experiment by its ID.
     *
     * @param id The ID of the experiment.
     * @return A response with the experiment details or an error message if not found.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Experiment>> getExperimentById(@PathVariable String id) {
        return experimentRepository
                .findById(id)
                .map(experiment -> ResponseEntity.ok(new ApiResponse<>(200, "Success", experiment)))
                .orElseGet(
                        () -> {
                            ApiResponse<Experiment> response =
                                    new ApiResponse<>(
                                            404, "Experiment with ID " + id + " not found", null);
                            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
                        });
    }

    /**
     * Create a new experiment with the provided details.
     *
     * @param requestBody A map containing details of the experiment.
     * @return A response with the created experiment or an error message if required fields are
     *     missing.
     */
    @PostMapping
    public ResponseEntity<ApiResponse<Experiment>> createExperiment(
            @RequestBody Map<String, Object> requestBody) {

        String name = (String) requestBody.get("name");
        String riskAssessment = (String) requestBody.get("riskAssessment");
        String chemicalId = (String) requestBody.get("chemicalId");
        Short amount = ((Integer) requestBody.get("amount")).shortValue();
        String unit = (String) requestBody.get("unit");

        if (name == null || chemicalId == null || amount == null || unit == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse<>(400, "Missing required fields", null));
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

        return ResponseEntity.ok(new ApiResponse<>(200, "Success", savedExperiment));
    }

    /**
     * Update an existing experiment based on the provided ID and data.
     *
     * @param id The ID of the experiment to update.
     * @param experimentData A map containing fields to update and their new values.
     * @return A response with the updated experiment or an error message if unauthorized or
     *     invalid.
     */
    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponse<Experiment>> updateExperiment(
            @PathVariable String id, @Valid @RequestBody Map<String, Object> experimentData) {

        Integer userType = (Integer) experimentData.get("userType");
        if (userType == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse<>(400, "Please provide a valid userType", null));
        }

        if (!experimentRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(404, "Experiment with ID " + id + " not found", null));
        }

        // Retrieve the original experiment record
        Experiment originalExperiment = experimentRepository.findById(id).orElse(null);

        // Update fields based on userType restrictions
        switch (userType) {
            case 0: // Admin user: Can modify all fields
                experimentData.forEach(
                        (key, value) -> {
                            try {
                                Field field = Experiment.class.getDeclaredField(key);
                                field.setAccessible(true);
                                // Check field type and convert value if necessary
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
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(
                                new ApiResponse<>(
                                        403, "You are not authorized to use this API", null));
            case 2: // Supervisor: Can only modify fields starting with supervisor_
                // Check if the experiment is in status 0 (wait for supervisor approve)
                if (originalExperiment.getStatus() != 0) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                            .body(
                                    new ApiResponse<>(
                                            400,
                                            "Invalid status, please follow the approval steps",
                                            null));
                }
                Chemical chemical =
                        chemicalRepository
                                .findById(originalExperiment.getChemicalId())
                                .orElse(null);
                int riskCategory = chemical.getRiskCategory();
                Boolean supervisorApproveStatus =
                        (Boolean) experimentData.get("supervisorApproveStatus");
                if (supervisorApproveStatus != null) {
                    originalExperiment.setSupervisorApproveStatus(supervisorApproveStatus);
                    if (supervisorApproveStatus) {
                        originalExperiment.setSupervisorApproveTime(System.currentTimeMillis());
                        originalExperiment.setStatus(riskCategory > 0 ? (short) 1 : (short) 2);
                    } else {
                        if (experimentData.get("supervisorComment") != null) {
                            originalExperiment.setSupervisorComment(
                                    experimentData.get("supervisorComment").toString());
                        }
                    }
                }
                break;
            case 3: // Higher approver: Can only modify fields starting with higher_approve_
                // Check if the experiment is in status 1 (wait for higher approver approve)
                if (originalExperiment.getStatus() != 1) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                            .body(
                                    new ApiResponse<>(
                                            400,
                                            "Invalid status, please follow the approval steps",
                                            null));
                }
                Boolean higherApproveStatus = (Boolean) experimentData.get("higherApproveStatus");
                if (higherApproveStatus != null) {
                    originalExperiment.setHigherApproveStatus(higherApproveStatus);
                    if (higherApproveStatus) {
                        originalExperiment.setHigherApproveTime(
                                System.currentTimeMillis()); // 当前时间的 Unix timestamp (毫秒)
                        originalExperiment.setStatus((short) 2);
                    } else {
                        if (experimentData.get("higherApproveComment") != null) {
                            originalExperiment.setHigherApproveComment(
                                    experimentData.get("higherApproveComment").toString());
                        }
                    }
                }
                break;
            case 4: // Order manager: Can only modify fields starting with order_
                if (originalExperiment.getOrderApproveTime() == null) {
                    // Check if the experiment is in status 2 (wait for order confirm)
                    if (originalExperiment.getStatus() != 2) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                .body(
                                        new ApiResponse<>(
                                                400,
                                                "Invalid status, please follow the approval steps",
                                                null));
                    }

                    Boolean orderApproveStatus = (Boolean) experimentData.get("orderApproveStatus");
                    if (orderApproveStatus != null) {
                        originalExperiment.setOrderApproveStatus(orderApproveStatus);
                        if (orderApproveStatus) {
                            originalExperiment.setOrderApproveTime(System.currentTimeMillis());
                            originalExperiment.setStatus((short) 3);
                        } else {
                            if (experimentData.get("orderComment") != null) {
                                originalExperiment.setOrderComment(
                                        experimentData.get("orderComment").toString());
                            }
                        }
                    }
                } else if (originalExperiment.getOrderApproveStatus()
                        && originalExperiment.getOrderReceiveTime() == null) {
                    // Check if the experiment is in status 3 (ordered)
                    if (originalExperiment.getStatus() != 3) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                .body(
                                        new ApiResponse<>(
                                                400,
                                                "Invalid status, please follow the approval steps",
                                                null));
                    }
                    if (experimentData.get("orderReceiveTime") != null) {
                        originalExperiment.setOrderReceiveTime(
                                (Long) experimentData.get("orderReceiveTime"));
                        originalExperiment.setStatus((short) 4);
                    }
                } else if (originalExperiment.getOrderApproveStatus()
                        && originalExperiment.getOrderReceiveTime() != null
                        && originalExperiment.getOrderPlacedTime() == null) {
                    // Check if the experiment is in status 4 (received)
                    if (originalExperiment.getStatus() != 4) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                .body(
                                        new ApiResponse<>(
                                                400,
                                                "Invalid status, please follow the approval steps",
                                                null));
                    }
                    if (experimentData.get("orderPlacedTime") != null) {
                        originalExperiment.setOrderPlacedTime(
                                (Long) experimentData.get("orderPlacedTime"));
                        originalExperiment.setStatus((short) 5);
                    }
                }
                break;
            default:
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(new ApiResponse<>(400, "Invalid userType", null));
        }

        // Save the updated experiment
        experimentRepository.save(originalExperiment);
        return ResponseEntity.ok(new ApiResponse<>(200, "Success", originalExperiment));
    }

    /**
     * Delete a specific experiment by its ID.
     *
     * @param id The ID of the experiment to delete.
     * @return A response indicating whether the deletion was successful or an error message if not
     *     found.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteExperiment(
            @RequestBody Map<String, Object> requestBody, @PathVariable String id) {

        Integer userType = (Integer) requestBody.get("userType");
        if (userType == null || userType != 0) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(
                            new ApiResponse<>(
                                    403, "You are not authorized to delete this experiment", null));
        }

        if (!experimentRepository.existsById(id)) {
            ApiResponse<Void> response =
                    new ApiResponse<>(404, "Experiment with ID " + id + " not found", null);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }

        experimentRepository.deleteById(id);
        ApiResponse<Void> response = new ApiResponse<>(200, "Success", null);
        return ResponseEntity.ok(response);
    }
}
