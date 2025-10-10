package com.web.study.party.entities.enums.group;

import com.web.study.party.entities.enums.EnumMeta;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum GroupTopic implements EnumMeta {
    PROGRAMMING(
            "PROGRAMMING",
            "Programming",
            "Topics related to software development, coding, and programming languages.",
            "blue",
            "Code",
            1,
            true
    ),
    DESIGN(
            "DESIGN",
            "Design",
            "Topics related to graphic design, UI/UX, and visual arts.",
            "green",
            "Palette",
            2,
            true
    ),
    MARKETING(
            "MARKETING",
            "Marketing",
            "Topics related to marketing strategies, digital marketing, and advertising.",
            "red",
            "Megaphone",
            3,
            true
    ),
    BUSINESS(
            "BUSINESS",
            "Business",
            "Topics related to entrepreneurship, startups, and business management.",
            "yellow",
            "Briefcase",
            4,
            true
    ),
    PERSONAL_DEVELOPMENT(
            "PERSONAL_DEVELOPMENT",
            "Personal Development",
            "Topics related to self-improvement, productivity, and personal growth.",
            "purple",
            "User",
            5,
            true
    ),
    HEALTH_FITNESS(
            "HEALTH_FITNESS",
            "Health & Fitness",
            "Topics related to physical health, wellness, and fitness routines.",
            "pink",
            "Heart",
            6,
            true
    ),
    LANGUAGE_LEARNING(
            "LANGUAGE_LEARNING",
            "Language Learning",
            "Topics related to learning new languages and linguistics.",
            "teal",
            "Globe",
            7,
            true
    ),
    ART_CULTURE(
            "ART_CULTURE",
            "Art & Culture",
            "Topics related to art history, cultural studies, and artistic expression.",
            "orange",
            "Camera",
            8,
            true
    ),
    SCIENCE_TECHNOLOGY(
            "SCIENCE_TECHNOLOGY",
            "Science & Technology",
            "Topics related to scientific discoveries, innovations, and technological advancements.",
            "cyan",
            "Atom",
            9,
            true
    ),
    LITERATURE_WRITING(
            "LITERATURE_WRITING",
            "Literature & Writing",
            "Topics related to books, writing techniques, and literary analysis.",
            "brown",
            "Book",
            10,
            true
    ),
    TRAVEL_ADVENTURE(
            "TRAVEL_ADVENTURE",
            "Travel & Adventure",
            "Topics related to travel experiences, destinations, and adventure activities.",
            "lime",
            "Map",
            11,
            true
    ),
    FOOD_CULINARY(
            "FOOD_CULINARY",
            "Food & Culinary",
            "Topics related to cooking, recipes, and culinary arts.",
            "amber",
            "Coffee",
            12,
            true
    ),
    GAMING_ESPORTS(
            "GAMING_ESPORTS",
            "Gaming & Esports",
            "Topics related to video games, esports competitions, and gaming culture.",
            "indigo",
            "Gamepad",
            13,
            true
    ),
    MUSIC_PERFORMANCE(
            "MUSIC_PERFORMANCE",
            "Music & Performance",
            "Topics related to music genres, instruments, and live performances.",
            "violet",
            "Music",
            14,
            true
    ),
    PHOTOGRAPHY_FILM(
            "PHOTOGRAPHY_FILM",
            "Photography & Film",
            "Topics related to photography techniques, filmmaking, and visual storytelling.",
            "gray",
            "CameraOff",
            15,
            true
    ),
    ENVIRONMENT_SUSTAINABILITY(
            "ENVIRONMENT_SUSTAINABILITY",
            "Environment & Sustainability",
            "Topics related to environmental conservation, sustainability practices, and climate change.",
            "green",
            "Leaf",
            16,
            true
    ),
    SOCIAL_ISSUES_ACTIVISM(
            "SOCIAL_ISSUES_ACTIVISM",
            "Social Issues & Activism",
            "Topics related to social justice, activism, and community engagement.",
            "red",
            "Users",
            17,
            true
    ),
    FINANCE_INVESTING(
            "FINANCE_INVESTING",
            "Finance & Investing",
            "Topics related to personal finance, investment strategies, and economic trends.",
            "blue",
            "DollarSign",
            18,
            true
    ),
    PARENTING_FAMILY(
            "PARENTING_FAMILY",
            "Parenting & Family",
            "Topics related to parenting tips, family dynamics, and child development.",
            "pink",
            "Home",
            19,
            true
    ),
    RELIGION_SPIRITUALITY(
            "RELIGION_SPIRITUALITY",
            "Religion & Spirituality",
            "Topics related to religious beliefs, spiritual practices, and faith communities.",
            "purple",
            "Star",
            20,
            true
    ),
    HOBBIES_CRAFTS(
            "HOBBIES_CRAFTS",
            "Hobbies & Crafts",
            "Topics related to various hobbies, DIY projects, and crafting techniques.",
            "orange",
            "Scissors",
            21,
            true
    ),
    SPORTS_OUTDOORS(
            "SPORTS_OUTDOORS",
            "Sports & Outdoors",
            "Topics related to sports activities, outdoor adventures, and fitness challenges.",
            "teal",
            "Football",
            22,
            true
    ),
    OTHER(
            "OTHER",
            "Other",
            "Miscellaneous topics that do not fit into the predefined categories.",
            "black",
            "MoreHorizontal",
            99,
            true
    );

    private final String code;
    private final String label;
    private final String description;
    private final String color;  // gợi ý: dùng token: primary/blue/green… hoặc hex
    private final String icon;   // tên icon FE (Lucide: "Code", "Palette"…)
    private final int order;
    private final boolean active;

}
