package chemical_ordering_system.controller;

import chemical_ordering_system.model.ApiResponse;
import chemical_ordering_system.model.ChemicalOrgUnit;
import chemical_ordering_system.repository.ChemicalOrgUnitRepository;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chemical-org-units")
public class ChemicalOrgUnitController {

    @Autowired private ChemicalOrgUnitRepository chemicalOrgUnitRepository;

    @GetMapping
    public ApiResponse<List<ChemicalOrgUnit>> getAllChemicalOrgUnits() {
        List<ChemicalOrgUnit> units = chemicalOrgUnitRepository.findAll();
        return new ApiResponse<>(200, "Success", units);
    }

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

    @PostMapping
    public ResponseEntity<ApiResponse<ChemicalOrgUnit>> createChemicalOrgUnit(
            @Valid @RequestBody ChemicalOrgUnit unit) {
        ChemicalOrgUnit savedUnit = chemicalOrgUnitRepository.save(unit);
        return ResponseEntity.ok(new ApiResponse<>(200, "Success", savedUnit));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponse<ChemicalOrgUnit>> updateChemicalOrgUnit(
            @PathVariable String id, @Valid @RequestBody ChemicalOrgUnit unit) {
        if (!chemicalOrgUnitRepository.existsById(id)) {
            ApiResponse<ChemicalOrgUnit> response =
                    new ApiResponse<>(404, "ChemicalOrgUnit with ID " + id + " not found", null);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
        unit.setId(id);
        ChemicalOrgUnit updatedUnit = chemicalOrgUnitRepository.save(unit);
        return ResponseEntity.ok(new ApiResponse<>(200, "Success", updatedUnit));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteChemicalOrgUnit(@PathVariable String id) {
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
