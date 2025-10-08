export const categories = [
    {
        id: 1,
        name: "Công nghệ thông tin",
        parent: null,
        icon: "computer",
        description:
            "Các công việc liên quan đến phát triển phần mềm, phần cứng và hạ tầng CNTT",
    },
    {
        id: 2,
        name: "Phát triển phần mềm",
        parent: 1,
        icon: "code",
        description: "Lập trình và phát triển ứng dụng, website",
    },
    {
        id: 3,
        name: "Frontend",
        parent: 2,
        icon: "web",
        description: "Phát triển giao diện người dùng cho website và ứng dụng",
    },
    {
        id: 4,
        name: "Backend",
        parent: 2,
        icon: "storage",
        description: "Phát triển máy chủ, API và cơ sở dữ liệu",
    },
    {
        id: 5,
        name: "Fullstack",
        parent: 2,
        icon: "layers",
        description: "Phát triển cả frontend và backend",
    },
    {
        id: 6,
        name: "Marketing",
        parent: null,
        icon: "campaign",
        description:
            "Các công việc liên quan đến tiếp thị, quảng cáo và xây dựng thương hiệu",
    },
    {
        id: 7,
        name: "Digital Marketing",
        parent: 6,
        icon: "trending_up",
        description: "Marketing trên các nền tảng số và mạng xã hội",
    },
    {
        id: 8,
        name: "Content Marketing",
        parent: 6,
        icon: "article",
        description: "Tạo và phân phối nội dung để thu hút khách hàng",
    },
    {
        id: 9,
        name: "Thiết kế",
        parent: null,
        icon: "palette",
        description:
            "Các công việc liên quan đến thiết kế đồ họa, sản phẩm và trải nghiệm người dùng",
    },
    {
        id: 10,
        name: "UI/UX Design",
        parent: 9,
        icon: "design_services",
        description: "Thiết kế giao diện và trải nghiệm người dùng",
    },
];
