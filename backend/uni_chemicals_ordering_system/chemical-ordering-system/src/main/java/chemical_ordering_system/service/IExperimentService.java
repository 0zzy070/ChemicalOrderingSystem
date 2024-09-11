package chemical_ordering_system.service;

import chemical_ordering_system.model.ApiResponse;
import chemical_ordering_system.model.Experiment;

import org.springframework.security.core.Authentication;

import java.util.List;
import java.util.Map;

public interface IExperimentService {
    ApiResponse<List<Experiment>> getAllExperiments();

    ApiResponse<Experiment> getExperimentById(String id);

    ApiResponse<Experiment> createExperiment(Map<String, Object> requestBody);

    ApiResponse<Experiment> updateExperiment(
            Authentication authentication, String id, Map<String, Object> requestBody);

    ApiResponse<Void> deleteExperiment(String id);
}
