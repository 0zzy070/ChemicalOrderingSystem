package chemical_ordering_system.controller;

import chemical_ordering_system.model.ApiResponse;
import chemical_ordering_system.model.OrganizationalUnit;
import chemical_ordering_system.repository.OrganizationalUnitRepository;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/organizational-units")
public class OrganizationalUnitController {

    @Autowired private OrganizationalUnitRepository organizationalUnitRepository;

    @GetMapping
    public ApiResponse<List<OrganizationalUnit>> getAllOrganizationalUnits() {
        List<OrganizationalUnit> units = organizationalUnitRepository.findAll();
        return new ApiResponse<>(200, "Success", units);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<OrganizationalUnit>> getOrganizationalUnitById(
            @PathVariable String id) {
        return organizationalUnitRepository
                .findById(id)
                .map(unit -> ResponseEntity.ok(new ApiResponse<>(200, "Success", unit)))
                .orElseGet(
                        () -> {
                            ApiResponse<OrganizationalUnit> response =
                                    new ApiResponse<>(
                                            404,
                                            "OrganizationalUnit with ID " + id + " not found",
                                            null);
                            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
                        });
    }

    @PostMapping
    public ResponseEntity<ApiResponse<OrganizationalUnit>> createOrganizationalUnit(
            @RequestParam("user_type") Integer userType,
            @Valid @RequestBody OrganizationalUnit unit) {
        if (userType == null || userType != 0) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(
                            new ApiResponse<>(
                                    403,
                                    "You are not authorized to create an organizational unit",
                                    null));
        }
        OrganizationalUnit savedUnit = organizationalUnitRepository.save(unit);
        return ResponseEntity.ok(new ApiResponse<>(200, "Success", savedUnit));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponse<OrganizationalUnit>> updateOrganizationalUnit(
            @RequestParam("user_type") Integer userType,
            @PathVariable String id,
            @Valid @RequestBody OrganizationalUnit unit) {
        if (userType == null || userType != 0) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(
                            new ApiResponse<>(
                                    403,
                                    "You are not authorized to update this organizational unit",
                                    null));
        }
        if (!organizationalUnitRepository.existsById(id)) {
            ApiResponse<OrganizationalUnit> response =
                    new ApiResponse<>(404, "OrganizationalUnit with ID " + id + " not found", null);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
        unit.setId(id);
        OrganizationalUnit updatedUnit = organizationalUnitRepository.save(unit);
        return ResponseEntity.ok(new ApiResponse<>(200, "Success", updatedUnit));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteOrganizationalUnit(
            @RequestParam("user_type") Integer userType, @PathVariable String id) {
        if (userType == null || userType != 0) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(
                            new ApiResponse<>(
                                    403,
                                    "You are not authorized to delete this organizational unit",
                                    null));
        }
        if (!organizationalUnitRepository.existsById(id)) {
            ApiResponse<Void> response =
                    new ApiResponse<>(404, "OrganizationalUnit with ID " + id + " not found", null);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
        organizationalUnitRepository.deleteById(id);
        ApiResponse<Void> response = new ApiResponse<>(200, "Success", null);
        return ResponseEntity.ok(response);
    }
}
