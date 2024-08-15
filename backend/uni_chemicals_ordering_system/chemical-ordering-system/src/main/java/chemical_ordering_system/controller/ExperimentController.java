package chemical_ordering_system.controller;

import chemical_ordering_system.model.ApiResponse;
import chemical_ordering_system.model.Experiment;
import chemical_ordering_system.repository.ExperimentRepository;

import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/experiments")
public class ExperimentController {

    @Autowired private ExperimentRepository experimentRepository;

    @GetMapping
    public ApiResponse<List<Experiment>> getAllExperiments() {
        List<Experiment> experiments = experimentRepository.findAll();
        return new ApiResponse<>(200, "Success", experiments);
    }

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

    @PostMapping
    public ResponseEntity<ApiResponse<Experiment>> createExperiment(
            @Valid @RequestBody Experiment experiment) {
        Experiment savedExperiment = experimentRepository.save(experiment);
        return ResponseEntity.ok(new ApiResponse<>(200, "Success", savedExperiment));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponse<Experiment>> updateExperiment(
            @PathVariable String id, @Valid @RequestBody Map<String, Object> experimentData) {

        Integer userType = (Integer) experimentData.get("user_type");
        if (userType == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse<>(400, "Please provide a valid user_type", null));
        }

        if (!experimentRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(404, "Experiment with ID " + id + " not found", null));
        }

        // Retrieve the original experiment record
        Experiment originalExperiment = experimentRepository.findById(id).orElse(null);
        Experiment updatedExperiment =
                new ObjectMapper().convertValue(experimentData, Experiment.class);

        // Update fields based on user_type restrictions
        switch (userType) {
            case 0: // Admin user: Can modify all fields
                break;
            case 1: // Research staff: Not authorized to use this API
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(
                                new ApiResponse<>(
                                        403, "You are not authorized to use this API", null));
            case 2: // Supervisor: Can only modify fields starting with supervisor_
                originalExperiment.updateSupervisorFields(updatedExperiment);
                break;
            case 3: // Higher approver: Can only modify fields starting with higher_approve_
                originalExperiment.updateHigherApproveFields(updatedExperiment);
                break;
            case 4: // Order manager: Can only modify fields starting with order_
                originalExperiment.updateOrderFields(updatedExperiment);
                break;
            default:
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(new ApiResponse<>(400, "Invalid user_type", null));
        }

        // Save the updated experiment
        experimentRepository.save(originalExperiment);
        return ResponseEntity.ok(new ApiResponse<>(200, "Success", originalExperiment));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteExperiment(
            @PathVariable String id, @RequestParam("user_type") Integer userType) {

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
