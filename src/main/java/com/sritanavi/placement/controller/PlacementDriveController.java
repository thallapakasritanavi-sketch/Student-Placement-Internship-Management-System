package com.sritanavi.placement.controller;

import com.sritanavi.placement.dto.ApiResponse;
import com.sritanavi.placement.dto.PlacementDriveDto;
import com.sritanavi.placement.service.PlacementDriveService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/placement-drives")
public class PlacementDriveController {

    private final PlacementDriveService placementDriveService;

    public PlacementDriveController(PlacementDriveService placementDriveService) {
        this.placementDriveService = placementDriveService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<PlacementDriveDto>>> getAllPlacementDrives() {
        return ResponseEntity.ok(ApiResponse.ok("Placement drives fetched", placementDriveService.getAllPlacementDrives()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PlacementDriveDto>> getPlacementDriveById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok("Placement drive fetched", placementDriveService.getPlacementDriveById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<PlacementDriveDto>> createPlacementDrive(@Valid @RequestBody PlacementDriveDto dto) {
        PlacementDriveDto created = placementDriveService.createPlacementDrive(dto);
        return new ResponseEntity<>(ApiResponse.ok("Placement drive scheduled successfully", created), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<PlacementDriveDto>> updatePlacementDrive(@PathVariable Long id, @RequestBody PlacementDriveDto dto) {
        PlacementDriveDto updated = placementDriveService.updatePlacementDrive(id, dto);
        return ResponseEntity.ok(ApiResponse.ok("Placement drive updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deletePlacementDrive(@PathVariable Long id) {
        placementDriveService.deletePlacementDrive(id);
        return ResponseEntity.ok(ApiResponse.ok("Placement drive deleted successfully"));
    }
}
