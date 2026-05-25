package com.web.services.enums;

import com.web.dto.mapper.enums.EnumGroupDTO;

import java.util.List;


public interface EnumsService {
    EnumGroupDTO getGroupPrivacy();

    EnumGroupDTO getGroupTopic();

    EnumGroupDTO getJoinPolicy();

    EnumGroupDTO getMemberRole();

    EnumGroupDTO getMemberState();

    EnumGroupDTO getRequestStatus();

    EnumGroupDTO getAccountStatus();

    EnumGroupDTO getRole();

    EnumGroupDTO getCodeStatus();

    List<EnumGroupDTO> getByNames(List<String> names);
}
