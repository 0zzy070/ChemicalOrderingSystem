package chemical_ordering_system.service;

import chemical_ordering_system.model.ApiResponse;
import chemical_ordering_system.model.ChemicalOrgUnit;

import java.util.List;
import java.util.Map;

public interface IChemicalOrgUnitService {
    ApiResponse<List<ChemicalOrgUnit>> getAllChemicalOrgUnits();

    ApiResponse<ChemicalOrgUnit> getChemicalOrgUnitById(String id);

    ApiResponse<ChemicalOrgUnit> createChemicalOrgUnit(Map<String, Object> requestBody);

    ApiResponse<ChemicalOrgUnit> updateChemicalOrgUnit(String id, Map<String, Object> requestBody);

    ApiResponse<Void> deleteChemicalOrgUnit(String id);
}
