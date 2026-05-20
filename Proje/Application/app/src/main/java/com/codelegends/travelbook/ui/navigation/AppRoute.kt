package com.codelegends.travelbook.ui.navigation

sealed class AppRoute(val route: String) {
    data object PublicShell : AppRoute("shell/public")
    data object AuthGraph : AppRoute("graph/auth")
    data object CompanyShell : AppRoute("shell/company")

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

    companion object {
        val companyTabRoutes: Set<String> = setOf(
            CompanyHome.route,
            CompanyDashboard.route,
            CompanyTours.route,
            CompanyGuides.route,
            CompanyProfile.route
        )

        fun isCompanyRole(role: String?): Boolean {
            return role.equals("company", ignoreCase = true)
        }
    }
}
