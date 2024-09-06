package chemical_ordering_system.controller;

import chemical_ordering_system.model.ApiResponse;
import chemical_ordering_system.model.Chemical;
import chemical_ordering_system.service.IChemicalService;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chemicals")
public class ChemicalController {

    @Autowired private IChemicalService chemicalService;

    /**
     * Get all chemicals from the database
     *
     * @return List of all chemicals
     */
    @GetMapping
    public ApiResponse<List<Chemical>> getAllChemicals() {
        return chemicalService.getAllChemicals();
    }

    /**
     * Get a chemical by its ID
     *
     * @param id The ID of the chemical
     * @return The chemical with the specified ID, or an error message if not found
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Chemical>> getChemicalById(@PathVariable String id) {
        return ResponseEntity.status(chemicalService.getChemicalById(id).getCode())
                .body(chemicalService.getChemicalById(id));
    }

    /**
     * Create a new chemical in the database
     *
     * @param requestBody The chemical details from the request body
     * @return The created chemical, or an error message if creation failed
     */
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<ApiResponse<Chemical>> createChemical(
            @Valid @RequestBody Map<String, Object> requestBody) {
        ApiResponse<Chemical> response = chemicalService.createChemical(requestBody);
        return ResponseEntity.status(response.getCode()).body(response);
    }

    /**
     * Update an existing chemical in the database
     *
     * @param id The ID of the chemical to update
     * @param requestBody The chemical details from the request body
     * @return The updated chemical, or an error message if update failed
     */
    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponse<Chemical>> updateChemical(
            @PathVariable String id, @Valid @RequestBody Map<String, Object> requestBody) {
        ApiResponse<Chemical> response = chemicalService.updateChemical(id, requestBody);
        return ResponseEntity.status(response.getCode()).body(response);
    }

    /**
     * Delete a chemical by its ID
     *
     * @param id The ID of the chemical to delete
     * @return A response indicating success or failure
     */
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteChemical(@PathVariable String id) {
        ApiResponse<Void> response = chemicalService.deleteChemical(id);
        return ResponseEntity.status(response.getCode()).body(response);
    }
}
