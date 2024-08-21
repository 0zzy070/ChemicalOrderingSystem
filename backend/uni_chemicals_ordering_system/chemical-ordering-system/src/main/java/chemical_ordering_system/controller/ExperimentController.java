package chemical_ordering_system.controller;

import chemical_ordering_system.model.ApiResponse;
import chemical_ordering_system.model.Experiment;
import chemical_ordering_system.service.IExperimentService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/experiments")
public class ExperimentController {

    @Autowired private IExperimentService experimentService;

    /**
     * Get a list of all experiments.
     *
     * @return ApiResponse containing the list of experiments
     */
    @GetMapping
    public ApiResponse<List<Experiment>> getAllExperiments() {
        return experimentService.getAllExperiments();
    }

    /**
     * Get an experiment by its ID.
     *
     * @param id the ID of the experiment
     * @return ApiResponse containing the experiment details
     */
    @GetMapping("/{id}")
    public ApiResponse<Experiment> getExperimentById(@PathVariable String id) {
        return experimentService.getExperimentById(id);
    }

    /**
     * Create a new experiment.
     *
     * @param requestBody the request body containing experiment details
     * @return ApiResponse containing the created experiment details
     */
    @PostMapping
    public ApiResponse<Experiment> createExperiment(@RequestBody Map<String, Object> requestBody) {
        return experimentService.createExperiment(requestBody);
    }

    /**
     * Update an existing experiment.
     *
     * @param id the ID of the experiment to update
     * @param requestBody the request body containing updated experiment details
     * @return ApiResponse containing the updated experiment details
     */
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERVISOR', 'HIGHER_APPROVER', 'ORDER_MANAGER')")
    @PatchMapping("/{id}")
    public ApiResponse<Experiment> updateExperiment(
            Authentication authentication,
            @PathVariable String id,
            @RequestBody Map<String, Object> requestBody) {
        return experimentService.updateExperiment(authentication, id, requestBody);
    }

    /**
     * Delete an experiment by its ID.
     *
     * @param id the ID of the experiment to delete
     * @param requestBody the request body containing the user type
     * @return ApiResponse indicating the result of the deletion
     */
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteExperiment(
            @PathVariable String id, @RequestBody Map<String, Object> requestBody) {
        return experimentService.deleteExperiment(id, requestBody);
    }
}
