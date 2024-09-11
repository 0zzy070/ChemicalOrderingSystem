package chemical_ordering_system.service.impl;

import chemical_ordering_system.model.ApiResponse;
import chemical_ordering_system.model.Chemical;
import chemical_ordering_system.model.ChemicalOrgUnit;
import chemical_ordering_system.repository.ChemicalOrgUnitRepository;
import chemical_ordering_system.repository.ChemicalRepository;
import chemical_ordering_system.service.IChemicalOrgUnitService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class ChemicalOrgUnitServiceImpl implements IChemicalOrgUnitService {

    @Autowired private ChemicalOrgUnitRepository chemicalOrgUnitRepository;

    @Autowired private ChemicalRepository chemicalRepository;

    @Override
    public ApiResponse<List<ChemicalOrgUnit>> getAllChemicalOrgUnits() {
        List<ChemicalOrgUnit> units = chemicalOrgUnitRepository.findAll();
        return new ApiResponse<>(200, "Success", units);
    }

    @Override
    public ApiResponse<ChemicalOrgUnit> getChemicalOrgUnitById(String id) {
        return chemicalOrgUnitRepository
                .findById(id)
                .map(unit -> new ApiResponse<>(200, "Success", unit))
                .orElseGet(
                        () ->
                                new ApiResponse<>(
                                        404, "ChemicalOrgUnit with ID " + id + " not found", null));
    }

    @Override
    public ApiResponse<ChemicalOrgUnit> createChemicalOrgUnit(Map<String, Object> requestBody) {
        ChemicalOrgUnit chemicalOrgUnit = new ChemicalOrgUnit();
        chemicalOrgUnit.setExperimentId((String) requestBody.get("experimentId"));
        chemicalOrgUnit.setChemicalId((String) requestBody.get("chemicalId"));
        chemicalOrgUnit.setStorageLocationId((String) requestBody.get("storageLocationId"));
        Chemical chemical =
                chemicalRepository.findById(requestBody.get("chemicalId").toString()).orElse(null);
        short storagePeriod = chemical.getStoragePeriod();
        long expireDate = System.currentTimeMillis() + ((long) storagePeriod * 24 * 60 * 60 * 1000);
        chemicalOrgUnit.setExpireDate(expireDate);

        ChemicalOrgUnit savedUnit = chemicalOrgUnitRepository.save(chemicalOrgUnit);
        return new ApiResponse<>(200, "Success", savedUnit);
    }

    @Override
    public ApiResponse<ChemicalOrgUnit> updateChemicalOrgUnit(
            String id, Map<String, Object> requestBody) {
        if (!chemicalOrgUnitRepository.existsById(id)) {
            return new ApiResponse<>(404, "ChemicalOrgUnit with ID " + id + " not found", null);
        }

        ChemicalOrgUnit chemicalOrgUnit = chemicalOrgUnitRepository.findById(id).orElseThrow();

        if (requestBody.containsKey("experimentId")) {
            chemicalOrgUnit.setExperimentId((String) requestBody.get("experimentId"));
        }
        if (requestBody.containsKey("chemicalId")) {
            chemicalOrgUnit.setChemicalId((String) requestBody.get("chemicalId"));
        }
        if (requestBody.containsKey("storageLocationId")) {
            chemicalOrgUnit.setStorageLocationId((String) requestBody.get("storageLocationId"));
        }

        ChemicalOrgUnit updatedUnit = chemicalOrgUnitRepository.save(chemicalOrgUnit);
        return new ApiResponse<>(200, "Success", updatedUnit);
    }

    @Override
    public ApiResponse<Void> deleteChemicalOrgUnit(String id) {
        if (!chemicalOrgUnitRepository.existsById(id)) {
            return new ApiResponse<>(404, "ChemicalOrgUnit with ID " + id + " not found", null);
        }

        chemicalOrgUnitRepository.deleteById(id);
        return new ApiResponse<>(200, "Success", null);
    }
}
