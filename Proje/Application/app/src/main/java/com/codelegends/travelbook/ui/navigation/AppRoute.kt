package com.codelegends.travelbook.ui.navigation

sealed class AppRoute(val route: String) {
    data object PublicShell : AppRoute("shell/public")
    data object AuthGraph : AppRoute("graph/auth")
    data object CompanyShell : AppRoute("shell/company")
    data object GuideShell : AppRoute("shell/guide")

    data object PublicHome : AppRoute("public/home")
    data object PublicTours : AppRoute("public/tours")
    data object PublicAbout : AppRoute("public/about")

    data object Login : AppRoute("auth/login")
    data object Register : AppRoute("auth/register")

    data object CompanyHome : AppRoute("company/home")
    data object CompanyDashboard : AppRoute("company/dashboard")
    data object CompanyTours : AppRoute("company/tours")
    data object CompanyTourCreate : AppRoute("company/tours/create")
    data object CompanyTourDetail : AppRoute("company/tours/{tourId}") {
        fun createRoute(tourId: String) = "company/tours/$tourId"
    }

    data object CompanyGuides : AppRoute("company/guides")
    data object CompanyProfile : AppRoute("company/profile")

    data object GuideHome : AppRoute("guide/home")
    data object GuideDashboard : AppRoute("guide/dashboard")
    data object GuideCompanies : AppRoute("guide/companies")
    data object GuideMyCompanies : AppRoute("guide/my-companies")
    data object GuideMyTours : AppRoute("guide/my-tours")
    data object GuideProfile : AppRoute("guide/profile")

    companion object {
        val companyTabRoutes: Set<String> = setOf(
            CompanyHome.route,
            CompanyDashboard.route,
            CompanyTours.route,
            CompanyGuides.route,
            CompanyProfile.route
        )

        val guideTabRoutes: Set<String> = setOf(
            GuideHome.route,
            GuideDashboard.route,
            GuideCompanies.route,
            GuideMyCompanies.route,
            GuideMyTours.route,
            GuideProfile.route
        )

        fun isCompanyRole(role: String?): Boolean {
            return role.equals("company", ignoreCase = true)
        }

        fun isGuideRole(role: String?): Boolean {
            return role.equals("guide", ignoreCase = true)
        }
    }
}
