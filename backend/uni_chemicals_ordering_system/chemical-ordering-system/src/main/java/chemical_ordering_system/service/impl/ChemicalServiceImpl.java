package chemical_ordering_system.service.impl;

import chemical_ordering_system.model.ApiResponse;
import chemical_ordering_system.model.Chemical;
import chemical_ordering_system.repository.ChemicalRepository;
import chemical_ordering_system.service.IChemicalService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class ChemicalServiceImpl implements IChemicalService {

    @Autowired private ChemicalRepository chemicalRepository;

    @Override
    public ApiResponse<List<Chemical>> getAllChemicals() {
        List<Chemical> chemicals = chemicalRepository.findAll();
        return new ApiResponse<>(200, "Success", chemicals);
    }

    @Override
    public ApiResponse<Chemical> getChemicalById(String id) {
        return chemicalRepository
                .findById(id)
                .map(chemical -> new ApiResponse<>(200, "Success", chemical))
                .orElseGet(
                        () ->
                                new ApiResponse<>(
                                        404, "Chemical with ID " + id + " not found", null));
    }

    @Override
    public ApiResponse<Chemical> createChemical(Map<String, Object> requestBody) {
        Chemical chemical = new Chemical();
        chemical.setId((String) requestBody.get("id"));
        chemical.setCommonName((String) requestBody.get("commonName"));
        chemical.setSystematicName((String) requestBody.get("systematicName"));
        chemical.setRiskCategory(((Integer) requestBody.get("riskCategory")).shortValue());
        chemical.setStoragePeriod(((Integer) requestBody.get("storagePeriod")).shortValue());

        if (chemicalRepository.existsById(chemical.getId())) {
            return new ApiResponse<>(
                    400, "Chemical with ID " + chemical.getId() + " already exists", null);
        }

        Chemical savedChemical = chemicalRepository.save(chemical);
        return new ApiResponse<>(200, "Success", savedChemical);
    }

    @Override
    public ApiResponse<Chemical> updateChemical(String id, Map<String, Object> requestBody) {
        if (!chemicalRepository.existsById(id)) {
            return new ApiResponse<>(404, "Chemical with ID " + id + " not found", null);
        }

        Chemical chemical = chemicalRepository.findById(id).orElseThrow();

        if (requestBody.containsKey("commonName")) {
            chemical.setCommonName((String) requestBody.get("commonName"));
        }
        if (requestBody.containsKey("systematicName")) {
            chemical.setSystematicName((String) requestBody.get("systematicName"));
        }
        if (requestBody.containsKey("riskCategory")) {
            chemical.setRiskCategory(((Integer) requestBody.get("riskCategory")).shortValue());
        }
        if (requestBody.containsKey("storagePeriod")) {
            chemical.setStoragePeriod(((Integer) requestBody.get("storagePeriod")).shortValue());
        }

        Chemical updatedChemical = chemicalRepository.save(chemical);
        return new ApiResponse<>(200, "Success", updatedChemical);
    }

    @Override
    public ApiResponse<Void> deleteChemical(String id, Map<String, Object> requestBody) {
        if (!chemicalRepository.existsById(id)) {
            return new ApiResponse<>(404, "Chemical with ID " + id + " not found", null);
        }

        chemicalRepository.deleteById(id);
        return new ApiResponse<>(200, "Success", null);
    }
}
