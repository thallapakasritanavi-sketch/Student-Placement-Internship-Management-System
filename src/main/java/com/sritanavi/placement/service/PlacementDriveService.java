package com.sritanavi.placement.service;

import com.sritanavi.placement.dto.PlacementDriveDto;
import com.sritanavi.placement.entity.PlacementDrive;
import com.sritanavi.placement.exception.ResourceNotFoundException;
import com.sritanavi.placement.repository.PlacementDriveRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PlacementDriveService {

    private final PlacementDriveRepository placementDriveRepository;

    public PlacementDriveService(PlacementDriveRepository placementDriveRepository) {
        this.placementDriveRepository = placementDriveRepository;
    }

    public List<PlacementDriveDto> getAllPlacementDrives() {
        return placementDriveRepository.findAllByOrderByDriveDateAsc().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public PlacementDriveDto getPlacementDriveById(Long id) {
        PlacementDrive drive = placementDriveRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Placement drive not found with id: " + id));
        return mapToDto(drive);
    }

    @Transactional
    public PlacementDriveDto createPlacementDrive(PlacementDriveDto dto) {
        PlacementDrive drive = new PlacementDrive();
        drive.setCompanyName(dto.getCompanyName().trim());
        drive.setJobPosition(dto.getJobPosition().trim());
        drive.setDriveDate(dto.getDriveDate());
        drive.setRegistrationDeadline(dto.getRegistrationDeadline());
        drive.setLocation(dto.getLocation());
        drive.setEligibility(dto.getEligibility());
        drive.setRequiredSkills(dto.getRequiredSkills());
        drive.setPackageAmount(dto.getPackageAmount());
        drive.setDescription(dto.getDescription());
        drive.setStatus(dto.getStatus() != null ? dto.getStatus() : "UPCOMING");

        PlacementDrive saved = placementDriveRepository.save(drive);
        return mapToDto(saved);
    }

    @Transactional
    public PlacementDriveDto updatePlacementDrive(Long id, PlacementDriveDto dto) {
        PlacementDrive drive = placementDriveRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Placement drive not found with id: " + id));

        if (dto.getCompanyName() != null) drive.setCompanyName(dto.getCompanyName().trim());
        if (dto.getJobPosition() != null) drive.setJobPosition(dto.getJobPosition().trim());
        if (dto.getDriveDate() != null) drive.setDriveDate(dto.getDriveDate());
        if (dto.getRegistrationDeadline() != null) drive.setRegistrationDeadline(dto.getRegistrationDeadline());
        if (dto.getLocation() != null) drive.setLocation(dto.getLocation());
        if (dto.getEligibility() != null) drive.setEligibility(dto.getEligibility());
        if (dto.getRequiredSkills() != null) drive.setRequiredSkills(dto.getRequiredSkills());
        if (dto.getPackageAmount() != null) drive.setPackageAmount(dto.getPackageAmount());
        if (dto.getDescription() != null) drive.setDescription(dto.getDescription());
        if (dto.getStatus() != null) drive.setStatus(dto.getStatus());

        PlacementDrive updated = placementDriveRepository.save(drive);
        return mapToDto(updated);
    }

    @Transactional
    public void deletePlacementDrive(Long id) {
        if (!placementDriveRepository.existsById(id)) {
            throw new ResourceNotFoundException("Placement drive not found with id: " + id);
        }
        placementDriveRepository.deleteById(id);
    }

    private PlacementDriveDto mapToDto(PlacementDrive d) {
        PlacementDriveDto dto = new PlacementDriveDto();
        dto.setId(d.getId());
        dto.setCompanyName(d.getCompanyName());
        dto.setJobPosition(d.getJobPosition());
        dto.setDriveDate(d.getDriveDate());
        dto.setRegistrationDeadline(d.getRegistrationDeadline());
        dto.setLocation(d.getLocation());
        dto.setEligibility(d.getEligibility());
        dto.setRequiredSkills(d.getRequiredSkills());
        dto.setPackageAmount(d.getPackageAmount());
        dto.setDescription(d.getDescription());
        dto.setStatus(d.getStatus());
        dto.setCreatedAt(d.getCreatedAt());
        return dto;
    }
}
