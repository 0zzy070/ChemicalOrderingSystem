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
import java.util.Map;

@RestController
@RequestMapping("/api/chemicals")
public class ChemicalController {

    @Autowired private ChemicalRepository chemicalRepository;

    /**
     * Get all chemicals.
     *
     * @return A list of all chemicals.
     */
    @GetMapping
    public ApiResponse<List<Chemical>> getAllChemicals() {
        List<Chemical> chemicals = chemicalRepository.findAll();
        return new ApiResponse<>(200, "Success", chemicals);
    }

    /**
     * Get a specific chemical by its ID.
     *
     * @param id The CAS Number of the chemical to retrieve.
     * @return The chemical if found, otherwise a not found error.
     */
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

    /**
     * Create a new chemical.
     *
     * @param requestBody The details of the chemical to create.
     * @return The created chemical or an error if unauthorized or already exists.
     */
    @PostMapping
    public ResponseEntity<ApiResponse<Chemical>> createChemical(
            @Valid @RequestBody Map<String, Object> requestBody) {

        Integer userType = (Integer) requestBody.get("userType");
        if (userType == null || userType != 0) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(
                            new ApiResponse<>(
                                    403, "You are not authorized to create a chemical", null));
        }

        Chemical chemical = new Chemical();
        chemical.setId((String) requestBody.get("id"));
        chemical.setCommonName((String) requestBody.get("commonName"));
        chemical.setSystematicName((String) requestBody.get("systematicName"));
        chemical.setRiskCategory(((Integer) requestBody.get("riskCategory")).shortValue());
        chemical.setStoragePeriod(((Integer) requestBody.get("storagePeriod")).shortValue());

        if (chemicalRepository.existsById(chemical.getId())) {
            ApiResponse<Chemical> response =
                    new ApiResponse<>(
                            400, "Chemical with ID " + chemical.getId() + " already exists", null);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
        Chemical savedChemical = chemicalRepository.save(chemical);
        return ResponseEntity.ok(new ApiResponse<>(200, "Success", savedChemical));
    }

    /**
     * Update an existing chemical.
     *
     * @param id The CAS Number of the chemical to update.
     * @param requestBody The details to update.
     * @return The updated chemical or an error if unauthorized or not found.
     */
    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponse<Chemical>> updateChemical(
            @PathVariable String id, @Valid @RequestBody Map<String, Object> requestBody) {

        Integer userType = (Integer) requestBody.get("userType");
        if (userType == null || userType != 0) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(
                            new ApiResponse<>(
                                    403, "You are not authorized to update this chemical", null));
        }

        if (!chemicalRepository.existsById(id)) {
            ApiResponse<Chemical> response =
                    new ApiResponse<>(404, "Chemical with ID " + id + " not found", null);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
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
        return ResponseEntity.ok(new ApiResponse<>(200, "Success", updatedChemical));
    }

    /**
     * Delete a chemical by its ID.
     *
     * @param id The CAS Number of the chemical to delete.
     * @param requestBody User details for authorization.
     * @return Success message or an error if unauthorized or not found.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteChemical(
            @RequestBody Map<String, Object> requestBody, @PathVariable String id) {

        Integer userType = (Integer) requestBody.get("userType");
        if (userType == null || userType != 0) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(
                            new ApiResponse<>(
                                    403, "You are not authorized to delete this chemical", null));
        }

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
