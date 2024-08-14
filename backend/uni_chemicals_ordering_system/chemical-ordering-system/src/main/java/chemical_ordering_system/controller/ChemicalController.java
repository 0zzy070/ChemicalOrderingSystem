package chemical_ordering_system.controller;

import chemical_ordering_system.model.ApiResponse;
import chemical_ordering_system.model.Chemical;
import chemical_ordering_system.repository.ChemicalRepository;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chemicals")
public class ChemicalController {

    @Autowired private ChemicalRepository chemicalRepository;

    @GetMapping
    public ApiResponse<List<Chemical>> getAllChemicals() {
        List<Chemical> chemicals = chemicalRepository.findAll();
        return new ApiResponse<>(200, "Success", chemicals);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Chemical>> getChemicalById(@PathVariable String id) {
        return chemicalRepository
                .findById(id)
                .map(chemical -> ResponseEntity.ok(new ApiResponse<>(200, "Success", chemical)))
                .orElseGet(
                        () -> {
                            ApiResponse<Chemical> response =
                                    new ApiResponse<>(
                                            404, "Chemical with ID " + id + " not found", null);
                            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
                        });
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Chemical>> createChemical(
            @Valid @RequestBody Chemical chemical) {
        if (chemicalRepository.existsById(chemical.getId())) {
            ApiResponse<Chemical> response =
                    new ApiResponse<>(
                            400, "Chemical with ID " + chemical.getId() + " already exists", null);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
        Chemical savedChemical = chemicalRepository.save(chemical);
        return ResponseEntity.ok(new ApiResponse<>(200, "Success", savedChemical));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponse<Chemical>> updateChemical(
            @PathVariable String id, @Valid @RequestBody Chemical chemical) {
        if (!chemicalRepository.existsById(id)) {
            ApiResponse<Chemical> response =
                    new ApiResponse<>(404, "Chemical with ID " + id + " not found", null);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
        chemical.setId(id);
        Chemical updatedChemical = chemicalRepository.save(chemical);
        return ResponseEntity.ok(new ApiResponse<>(200, "Success", updatedChemical));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteChemical(@PathVariable String id) {
        if (!chemicalRepository.existsById(id)) {
            ApiResponse<Void> response =
                    new ApiResponse<>(404, "Chemical with ID " + id + " not found", null);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
        chemicalRepository.deleteById(id);
        ApiResponse<Void> response = new ApiResponse<>(200, "Success", null);
        return ResponseEntity.ok(response);
    }
}
