package chemical_ordering_system.controller;

import chemical_ordering_system.model.ApiResponse;
import chemical_ordering_system.model.Experiment;
import chemical_ordering_system.repository.ExperimentRepository;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
            @PathVariable String id, @Valid @RequestBody Experiment experiment) {
        if (!experimentRepository.existsById(id)) {
            ApiResponse<Experiment> response =
                    new ApiResponse<>(404, "Experiment with ID " + id + " not found", null);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
        experiment.setId(id);
        Experiment updatedExperiment = experimentRepository.save(experiment);
        return ResponseEntity.ok(new ApiResponse<>(200, "Success", updatedExperiment));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteExperiment(@PathVariable String id) {
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
