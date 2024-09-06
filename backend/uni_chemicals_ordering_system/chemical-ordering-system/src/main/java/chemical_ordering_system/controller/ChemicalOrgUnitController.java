package chemical_ordering_system.controller;

import chemical_ordering_system.model.ApiResponse;
import chemical_ordering_system.model.ChemicalOrgUnit;
import chemical_ordering_system.service.IChemicalOrgUnitService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chemical-org-units")
public class ChemicalOrgUnitController {

    @Autowired private IChemicalOrgUnitService chemicalOrgUnitService;

    /**
     * Retrieve all chemical organizational units.
     *
     * @return List of all chemical organizational units.
     */
    @GetMapping
    public ApiResponse<List<ChemicalOrgUnit>> getAllChemicalOrgUnits() {
        return chemicalOrgUnitService.getAllChemicalOrgUnits();
    }

    /**
     * Retrieve a specific chemical organizational unit by its ID.
     *
     * @param id The ID of the chemical organizational unit.
     * @return The chemical organizational unit if found, or an error message if not found.
     */
    @GetMapping("/{id}")
    public ApiResponse<ChemicalOrgUnit> getChemicalOrgUnitById(@PathVariable String id) {
        return chemicalOrgUnitService.getChemicalOrgUnitById(id);
    }

    /**
     * Create a new chemical organizational unit.
     *
     * @param requestBody Contains details for the new chemical organizational unit.
     * @return The created chemical organizational unit or an error message if unauthorized.
     */
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ApiResponse<ChemicalOrgUnit> createChemicalOrgUnit(
            @RequestBody Map<String, Object> requestBody) {
        return chemicalOrgUnitService.createChemicalOrgUnit(requestBody);
    }

    /**
     * Update an existing chemical organizational unit.
     *
     * @param id The ID of the chemical organizational unit to update.
     * @param requestBody Contains details to update the chemical organizational unit.
     * @return The updated chemical organizational unit or an error message if unauthorized or not
     *     found.
     */
    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/{id}")
    public ApiResponse<ChemicalOrgUnit> updateChemicalOrgUnit(
            @PathVariable String id, @RequestBody Map<String, Object> requestBody) {
        return chemicalOrgUnitService.updateChemicalOrgUnit(id, requestBody);
    }

    /**
     * Delete a chemical organizational unit by its ID.
     *
     * @param id The ID of the chemical organizational unit to delete.
     * @return Success message or an error message if unauthorized or not found.
     */
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteChemicalOrgUnit(@PathVariable String id) {
        return chemicalOrgUnitService.deleteChemicalOrgUnit(id);
    }
}
