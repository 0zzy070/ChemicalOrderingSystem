package chemical_ordering_system.service;

import chemical_ordering_system.model.ApiResponse;
import chemical_ordering_system.model.Chemical;

import java.util.List;
import java.util.Map;

public interface IChemicalService {
    ApiResponse<List<Chemical>> getAllChemicals();

    ApiResponse<Chemical> getChemicalById(String id);

    ApiResponse<Chemical> createChemical(Map<String, Object> requestBody);

    ApiResponse<Chemical> updateChemical(String id, Map<String, Object> requestBody);

    ApiResponse<Void> deleteChemical(String id, Map<String, Object> requestBody);
}
