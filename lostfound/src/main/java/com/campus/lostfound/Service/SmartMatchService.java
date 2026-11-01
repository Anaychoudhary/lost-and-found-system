package com.campus.lostfound.Service;

import com.campus.lostfound.dto.MatchResponseDTO;

import java.util.List;

// [OOPS - ABSTRACTION]: Service interface defining match engine capabilities
public interface SmartMatchService {

    List<MatchResponseDTO> findAllMatches();

    List<MatchResponseDTO> findMatchesForLostItem(Long lostItemId);
}