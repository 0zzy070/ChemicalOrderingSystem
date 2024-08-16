package chemical_ordering_system.controller;

import chemical_ordering_system.dto.orgazation.OrganizationalUnitAddDTO;
import chemical_ordering_system.dto.orgazation.OrganizationalUnitUpdateDTO;
import chemical_ordering_system.exception.BusinessException;
import chemical_ordering_system.model.ApiResponse;
import chemical_ordering_system.model.OrganizationalUnit;
import chemical_ordering_system.server.IOrganizationalUnitService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/organizational-units")
public class OrganizationalUnitController {

    @Autowired
    private IOrganizationalUnitService organizationalUnitService;

    /**
     * Create OrganizationalUnit
     *
     * @param unit
     * @return
     * @throws BusinessException
     */
    @PostMapping
    public ResponseEntity<ApiResponse<OrganizationalUnit>> createOrganizationalUnit(
            @Valid @RequestBody OrganizationalUnitAddDTO unit) throws BusinessException {
        organizationalUnitService.addOrganizationalUnit(unit);
        return ResponseEntity.ok(new ApiResponse<>(200, "Success", null));
    }

    /**
     * This will delete the organization and all of its direct and indirect children
     *
     * @param id
     * @return
     */
    @PostMapping("deleteById/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteOrganizationalUnit(@PathVariable String id) throws BusinessException {
        organizationalUnitService.deleteOrganizationalUnitById(id);
        ApiResponse<Void> response = new ApiResponse<>(200, "Success", null);
        return ResponseEntity.ok(response);
    }

    /**
     * Query all direct sub-institutions under the current institution
     *
     * @param id
     * @param childOrgType the orgType of direct sub-institutions.List all type of direct sub-institutions when childOrgType is -1
     * @return
     */
    @GetMapping("/{id}/{childOrgType}")
    public ApiResponse<List<OrganizationalUnit>> listDirectChildren(@PathVariable String id, @PathVariable Integer childOrgType) throws BusinessException {
        List<OrganizationalUnit> units = organizationalUnitService.listDirectChildren(id, childOrgType);
        return new ApiResponse<>(200, "Success", units);
    }

    /**
     * list OrganizationalUnit by orgType,list all if orgType=-1
     * @param orgType
     * @return
     * @throws BusinessException
     */
    @GetMapping("/{orgType}")
    public ApiResponse<List<OrganizationalUnit>> listByOrgType(@PathVariable Integer orgType) throws BusinessException {
        List<OrganizationalUnit> units = organizationalUnitService.listByType(orgType);
        return new ApiResponse<>(200, "Success", units);
    }

    @PostMapping("/updateUnitById")
    public ResponseEntity<ApiResponse<OrganizationalUnit>> updateUnitById(
            @Valid @RequestBody OrganizationalUnitUpdateDTO unit) throws BusinessException {
        organizationalUnitService.updateOrganizationalUnit(unit);
        return ResponseEntity.ok(new ApiResponse<>(200, "Success", null));
    }

}
