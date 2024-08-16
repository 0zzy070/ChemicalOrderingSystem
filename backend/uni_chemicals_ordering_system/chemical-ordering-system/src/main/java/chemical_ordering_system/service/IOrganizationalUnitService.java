package chemical_ordering_system.service;

import chemical_ordering_system.dto.orgazation.OrganizationalUnitAddDTO;
import chemical_ordering_system.dto.orgazation.OrganizationalUnitUpdateDTO;
import chemical_ordering_system.exception.BusinessException;
import chemical_ordering_system.model.OrganizationalUnit;
import jakarta.validation.Valid;

import java.util.List;

public interface IOrganizationalUnitService {

    void addOrganizationalUnit(OrganizationalUnitAddDTO unit) throws BusinessException;

    void deleteOrganizationalUnitById(String id) throws BusinessException;

    List<OrganizationalUnit> listDirectChildren(String id, Integer childOrgType) throws BusinessException;

    List<OrganizationalUnit> listByType(Integer orgType);

    void updateOrganizationalUnit(@Valid OrganizationalUnitUpdateDTO unit) throws BusinessException;
}
