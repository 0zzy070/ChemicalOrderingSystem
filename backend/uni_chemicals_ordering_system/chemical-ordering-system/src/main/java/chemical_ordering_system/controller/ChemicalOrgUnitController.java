package chemical_ordering_system.controller;

import chemical_ordering_system.model.ApiResponse;
import chemical_ordering_system.model.Chemical;
import chemical_ordering_system.model.ChemicalOrgUnit;
import chemical_ordering_system.repository.ChemicalOrgUnitRepository;
import chemical_ordering_system.repository.ChemicalRepository;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chemical-org-units")
public class ChemicalOrgUnitController {

    @Autowired private ChemicalOrgUnitRepository chemicalOrgUnitRepository;
    @Autowired private ChemicalRepository chemicalRepository;

    /**
     * Retrieve all chemical organizational units.
     *
     * @return List of all chemical organizational units.
     */
    @GetMapping
    public ApiResponse<List<ChemicalOrgUnit>> getAllChemicalOrgUnits() {
        List<ChemicalOrgUnit> units = chemicalOrgUnitRepository.findAll();
        return new ApiResponse<>(200, "Success", units);
    }

    /**
     * Retrieve a specific chemical organizational unit by its ID.
     *
     * @param id The ID of the chemical organizational unit.
     * @return The chemical organizational unit if found, or an error message if not found.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ChemicalOrgUnit>> getChemicalOrgUnitById(
            @PathVariable String id) {
        return chemicalOrgUnitRepository
                .findById(id)
                .map(unit -> ResponseEntity.ok(new ApiResponse<>(200, "Success", unit)))
                .orElseGet(
                        () -> {
                            ApiResponse<ChemicalOrgUnit> response =
                                    new ApiResponse<>(
                                            404,
                                            "ChemicalOrgUnit with ID " + id + " not found",
                                            null);
                            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
                        });
    }

    /**
     * Create a new chemical organizational unit.
     *
     * @param requestBody Contains details for the new chemical organizational unit.
     * @return The created chemical organizational unit or an error message if unauthorized.
     */
    @PostMapping
    public ResponseEntity<ApiResponse<ChemicalOrgUnit>> createChemicalOrgUnit(
            @Valid @RequestBody Map<String, Object> requestBody) {
        Integer userType = (Integer) requestBody.get("userType");
        if (userType == null || userType != 0) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(
                            new ApiResponse<>(
                                    403, "You are not authorized to create a chemical", null));
        }
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
        return ResponseEntity.ok(new ApiResponse<>(200, "Success", savedUnit));
    }

    /**
     * Update an existing chemical organizational unit.
     *
     * @param id The ID of the chemical organizational unit to update.
     * @param requestBody Contains details to update the chemical organizational unit.
     * @return The updated chemical organizational unit or an error message if unauthorized or not
     *     found.
     */
    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponse<ChemicalOrgUnit>> updateChemicalOrgUnit(
            @PathVariable String id, @Valid @RequestBody Map<String, Object> requestBody) {

        Integer userType = (Integer) requestBody.get("userType");
        if (userType == null || userType != 0) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(
                            new ApiResponse<>(
                                    403, "You are not authorized to update this chemical", null));
        }

        if (!chemicalOrgUnitRepository.existsById(id)) {
            ApiResponse<ChemicalOrgUnit> response =
                    new ApiResponse<>(404, "ChemicalOrgUnit with ID " + id + " not found", null);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
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
        return ResponseEntity.ok(new ApiResponse<>(200, "Success", updatedUnit));
    }

    /**
     * Delete a chemical organizational unit by its ID.
     *
     * @param id The ID of the chemical organizational unit to delete.
     * @param requestBody User details for authorization.
     * @return Success message or an error message if unauthorized or not found.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteChemicalOrgUnit(
            @RequestBody Map<String, Object> requestBody, @PathVariable String id) {
        Integer userType = (Integer) requestBody.get("userType");
        if (userType == null || userType != 0) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(
                            new ApiResponse<>(
                                    403, "You are not authorized to delete this chemical", null));
        }

        if (!chemicalOrgUnitRepository.existsById(id)) {
            ApiResponse<Void> response =
                    new ApiResponse<>(404, "ChemicalOrgUnit with ID " + id + " not found", null);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }

        chemicalOrgUnitRepository.deleteById(id);
        ApiResponse<Void> response = new ApiResponse<>(200, "Success", null);
        return ResponseEntity.ok(response);
    }
}
