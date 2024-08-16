package chemical_ordering_system.service.impl;

import chemical_ordering_system.dto.orgazation.OrganizationalUnitAddDTO;
import chemical_ordering_system.dto.orgazation.OrganizationalUnitUpdateDTO;
import chemical_ordering_system.enums.ErrorEnum;
import chemical_ordering_system.enums.OrganizationalUnitAvailableEnum;
import chemical_ordering_system.enums.OrganizationalUnitTypeEnum;
import chemical_ordering_system.exception.BusinessException;
import chemical_ordering_system.model.OrganizationalUnit;
import chemical_ordering_system.repository.OrganizationalUnitRepository;
import chemical_ordering_system.service.IOrganizationalUnitService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class OrganizationalUnitServiceImpl implements IOrganizationalUnitService {

    @Autowired
    private OrganizationalUnitRepository organizationalUnitRepository;


    @Override
    public void addOrganizationalUnit(OrganizationalUnitAddDTO unit) throws BusinessException {
        OrganizationalUnit pUnit = organizationalUnitRepository.findById(unit.getPid()).orElse(null);
        if (pUnit == null) {
            throw new BusinessException(ErrorEnum.DATA_NOT_EXIST, "pid does not exist");
        }
        Integer pOrgType = pUnit.getOrgType();
        Integer orgType = unit.getOrgType();
        if (pOrgType.equals(OrganizationalUnitTypeEnum.STORAGE_LOCATIONS.getCode())) {
            throw new BusinessException(ErrorEnum.INVALID_INPUT, "Wrong organizational hierarchy");
        }

        boolean orgTypeValid = (orgType.equals(OrganizationalUnitTypeEnum.LABORATORIES.getCode()) && !pOrgType.equals(OrganizationalUnitTypeEnum.RESEARCH_CENTRES.getCode())) ||
                (orgType.equals(OrganizationalUnitTypeEnum.RESEARCH_CENTRES.getCode()) && !pOrgType.equals(OrganizationalUnitTypeEnum.INSTITUTES.getCode()));
        if (orgTypeValid) {
            throw new BusinessException(ErrorEnum.INVALID_INPUT, "Wrong organizational hierarchy");
        }
        OrganizationalUnit unitSave = new OrganizationalUnit();
        unitSave.setCreateTime(new Date().getTime());
        unitSave.setPid(unit.getPid());
        if (OrganizationalUnitTypeEnum.STORAGE_LOCATIONS.getCode().equals(unit.getOrgType())) {
            unitSave.setStatus(OrganizationalUnitAvailableEnum.AVAILABLE.getCode());
            if (null == unit.getHasSpecialEquipment()) {
                throw new BusinessException(ErrorEnum.INVALID_INPUT, "hasSpecialEquipment must not be null when orgType is 2");
            }
            unitSave.setHasSpecialEquipment(unit.getHasSpecialEquipment());
        } else {
            unitSave.setStatus(OrganizationalUnitAvailableEnum.OTHER.getCode());
            unitSave.setHasSpecialEquipment(null);
        }
        unitSave.setOrgType(unit.getOrgType());
        unitSave.setOrgName(unit.getOrgName());
        organizationalUnitRepository.save(unitSave);
    }

    @Override
    public void deleteOrganizationalUnitById(String id) throws BusinessException {
        if (!organizationalUnitRepository.existsById(id)) {
            throw new BusinessException(ErrorEnum.DATA_NOT_EXIST, "OrganizationalUnit with ID " + id + " not found");
        }
        OrganizationalUnit probe = new OrganizationalUnit();
        probe.setPid(id);
        Example<OrganizationalUnit> example = Example.of(probe);
        long count = organizationalUnitRepository.count(example);
        if (count > 0) {
            throw new BusinessException(ErrorEnum.OPERATION_NOT_ALLOWED, "Please delete the sub-organizations associated with the current organization first.");
        }
        organizationalUnitRepository.deleteById(id);
    }

    @Override
    public List<OrganizationalUnit> listDirectChildren(String id, Integer childOrgType) throws BusinessException {
        if (!organizationalUnitRepository.existsById(id)) {
            throw new BusinessException(ErrorEnum.DATA_NOT_EXIST, "OrganizationalUnit with ID " + id + " not found");
        }
        OrganizationalUnit probe = new OrganizationalUnit();
        probe.setPid(id);
        if (childOrgType != -1) {
            probe.setOrgType(childOrgType);
        }
        Example<OrganizationalUnit> example = Example.of(probe);
        return organizationalUnitRepository.findAll(example);
    }

    @Override
    public List<OrganizationalUnit> listByType(Integer orgType) {
        OrganizationalUnit probe = new OrganizationalUnit();
        if (orgType != -1) {
            probe.setOrgType(orgType);
        }
        return organizationalUnitRepository.findAll(Example.of(probe));
    }

    @Override
    public void updateOrganizationalUnit(OrganizationalUnitUpdateDTO unit) throws BusinessException {
        OrganizationalUnit oldUnit = organizationalUnitRepository.findById(unit.getId()).orElse(null);
        if (null == oldUnit) {
            throw new BusinessException(ErrorEnum.DATA_NOT_EXIST, "OrganizationalUnit with ID '" + unit.getId() + "' not found");
        }
        oldUnit.setOrgName(unit.getOrgName());
        oldUnit.setUpdateTime(new Date().getTime());
        if (unit.getHasSpecialEquipment() != null && OrganizationalUnitTypeEnum.isStorageLocation(oldUnit.getOrgType())) {
            oldUnit.setHasSpecialEquipment(unit.getHasSpecialEquipment());
        }
        organizationalUnitRepository.saveAndFlush(oldUnit);
    }
}
