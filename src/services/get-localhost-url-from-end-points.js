export const getLocalhostUrlFromEndPoints = (endpoint) => {
    endpoint = endpoint.replace("tw/", "");
    if (endpoint.indexOf('?') > -1)
        endpoint = endpoint.split('?')[0];

    if (endpoints.tourwiz.filter(x => x.indexOf(endpoint) > -1).length > 0) {
        return endpoints.ports["tourwiz"];
    }
    else if (endpoints.quotations.filter(x => x.indexOf(endpoint) > -1).length > 0) {
        return endpoints.ports["quotations"];
    }
    else if (endpoints.admin.filter(x => x.indexOf(endpoint) > -1).length > 0) {
        return endpoints.ports["admin"];
    }
    else if (endpoints.reconciliation.filter(x => x.indexOf(endpoint) > -1).length > 0) {
        return endpoints.ports["reconciliation"];
    }
    else if (endpoints.reports.filter(x => x.indexOf(endpoint) > -1).length > 0) {
        return endpoints.ports["reports"];
    }
    else if (endpoints.cms.filter(x => x.indexOf(endpoint) > -1).length > 0) {
        return endpoints.ports["cms"];
    }
}
const endpoints = {
    "ports": {
        "tourwiz": "http://localhost:5101/",
        "quotations": "http://localhost:5102/",
        "admin": "http://localhost:5103/",
        "reconciliation": "http://localhost:5104/",
        "reports": "http://localhost:5105/",
        "cms": "http://localhost:5000/",
    },
    "tourwiz": [
        "/lookup/currency",
        "/setup/otp",
        "/setup",
        "/lookup/city",
        "/lookup/timezone",
        "/login",
        "/token/refresh",
        "/rsa/generate",
        "/validate/email",
        "/validate/domain",
        "/test/email",
        "/forgotpassword/otp",
        "/forgotpassword",
        "/sendemail",
        //"/quotations",
        //"/quotation",
        //"/quotation/update",
        //"/quotation/delete",
        //"/inquiries",
        //"/inquiry",
        //"/inquiry/update",
        //"/newquotations",
        //"/quotation",
        //"/newquotation",
        //"/quotation/newupdate",
        //"/newquotation",
        //"/newinquiries",
        //"/newinquiry",
        //"/newinquiry",
        //"/inquiry/newupdate",
        "/register/email",
        "/image/upload",
        "/export/customer",
        "/usage/usersnotsignedup",
        "/usage/activeusers",
        "/usage/userwisetransactionsummary",
        "/subscription/paymenthistory",
        "/subscription/details",
        "/subscription/paymentdetails",
        "/advertisement",
        "/totaladvertisement",
        "/sendemailwithtemplate",
        "/cmsportal/setup",
        "/portal/info",
        "/portal/availability",
        "/portal/updateurl",
        "/booking/update/itinerarydetails",
        "/getfixeddeals",
        "/manualinvoice/validateinvoicenumber",
        "/manualinvoice/create",
        "/manualinvoice/list",
        "/manualinvoice/details",
        "/plansubscription/detail",
        "/plansubscription/role",
        "/manualinvoice/invoicehtmlcontent",
        "/image/validate",
        "/user/clockin",
        "/user/clockout",
        "/user/checkaccessquota",
        "/user/attandencereport",
        "/manualinvoice/delete",
    ],
    "quotations": [
        //"/oldquotation",
        //"/oldquotations",
        //"/oldquotation",
        //"/quotation/oldupdate",
        "/quotation/delete",
        //"/oldinquiries",
        //"/oldinquiry",
        //"/oldinquiry",
        //"/inquiry/oldupdate",
        "/quotations",
        "/quotation",
        "/quotation/update",
        "/quotation",
        "/inquiries",
        "/report/inquiries",
        "/inquiry",
        "/inquiry",
        "/inquiry/update",
        //"/reports/lead",
        "/reward/summary",
        "/reward/itemdetail",
        "/reward/add",
        "/reward/redeem/lookup",
        "/reward/redeem/add",
        "/reward/delete",
        "/reward/setting",
        "/media/add",
        "/media/list",
        "/media/delete",
        "/paperrates/list",
        "paperrates/checkavailability",
        "paperrates/block",
        "paperrates/release",
        "/paperrates/generateticket",
        "/paperrates/sendrequestforprice",
        "/paperrates/details",
        "paperrates/addupdate",
        "/inquiry/activitylog",
        "/itinerary/send",
        "/quotation/send",
    ],
    "admin": [
        "/admin/lookup/country",
        "/admin/lookup/state",
        "/admin/lookup/city",
        "/admin/lookup/branch",
        "/admin/lookup/role",
        "/admin/lookup/crewnature",
        "/admin/lookup/customerclass",
        "/admin/employee/list",
        "/admin/employee/delete",
        "/admin/lookup/hintquestion",
        "/admin/lookup/language",
        "/admin/employee/add",
        "/admin/employee/update",
        "/admin/employee/login/create",
        "/admin/employee/user/details",
        "/admin/employee/login/update",
        "/admin/employee/password/change",
        "/admin/user/details",
        "/admin/lookup/timezone",
        "/admin/employee/details",
        "/admin/user/update",
        "/admin/lookup/dateformat",
        "/admin/class/list",
        "/admin/class/details",
        "/admin/class/delete",
        "/admin/class/update",
        "/admin/class/add",
        "/admin/branch/list",
        "/admin/branch/add",
        "/admin/branch/update",
        "/admin/branch/delete",
        "/admin/lookup/parentbranch",
        "/admin/agent/transaction",
        "/admin/agent/transaction/log",
        "/admin/agent/transaction/details",
        "/admin/agent/transaction/add",
        "/admin/employee/transaction",
        "/admin/lookup/paymenttype",
        "/admin/employee/transaction/details",
        "/admin/employee/transaction/addedit",
        "/admin/employee/transaction/logs",
        "/admin/agent/list",
        "/admin/agent/business/markup",
        "/admin/agent/business/markup/applied",
        "/admin/agent/addedit",
        "/admin/user/login",
        "/admin/user/login/reset",
        "/admin/policy/list",
        "/admin/policy/update",
        "/admin/pgcharges/list",
        "/admin/pgcharges/update",
        "/admin/businesses",
        "/admin/additionalcharges/list",
        "/admin/additionalcharges/detail",
        "/admin/additionalcharges/policy/detail",
        "/admin/additionalcharges/policy/mldetail",
        "/admin/additionalcharges/policy/multilingual/addupdate",
        "/admin/additionalcharges/policy/addupdate",
        "/admin/additionalcharges/policy/delete",
        "/admin/lookup/email",
        "/admin/email/types",
        "/admin/email/templates/list",
        "/admin/email/templates/detail",
        "/admin/email/templates/restore",
        "/admin/email/templates/update",
        "/admin/markupsetup/list",
        "/admin/markupsetup/publish/list",
        "/admin/markupsetup/publish/detail",
        "/admin/markupsetup/publish/delete",
        "/admin/markupsetup/pending/delete",
        "/admin/markupsetup/edit",
        "/admin/markupsetup/exception/list",
        "/admin/markupsetup/exception/detail",
        "/admin/markupsetup/exception/delete",
        "/admin/markupsetup/audit/list",
        "/admin/markupsetup/exception/detail/bycommissiondetailid",
        "/admin/lookup/exception-on",
        "/admin/lookup/bookingtypes",
        "/admin/lookup/serviceprovidercode",
        "/admin/exception/save",
        "/admin/markupsetup/publish",
        "/admin/securityroles/list",
        "/admin/securityroles/user/list",
        "/admin/securityroles/product/list",
        "/admin/securityroles/possiblepermission/list",
        "/admin/securityroles/permission/list",
        "/admin/securityroles/add",
        "/admin/securityroles/edit",
        "/admin/securityroles/copy",
        "/admin/securityroles/details",
        "/admin/securityroles/delete",
        "/uploadimage",
        "/export/customer",
        "/admin/offer",
        "/admin/partner/offer/add",
        "/admin/partner/offer/list",
        "/admin/partner/offer/update",
        "/admin/partner/offer/publish",
        "/admin/agent/offer/click",
        "/admin/agent/offer/list",
        "/admin/partner/offer/clickcountlist",
        "/admin/partner/offer/action",
        "/admin/lookup/signupcountry",
        "/admin/getconfigurations",
        "admin/updateconfigurations",
        "admin/security/getdetails",
        "admin/security/updatedetails",
        "admin/security/insertdetails",
        "openai/search",
    ],
    "reconciliation": [
        "/reconciliation/supplier/all",
        "/reconciliation/supplier/business",
        "/reconciliation/supplier/business/suppliers",
        "/reconciliation/supplier/status",
        "/reconciliation/supplier/invoice/list",
        "/reconciliation/supplier/invoice/listwithbrn",
        "/reconciliation/supplier/invoice/add",
        "/reconciliation/supplier/invoice/details",
        "/reconciliation/supplier/invoice/update",
        "/reconciliation/supplier/invoice/validate",
        "/reconciliation/supplier/invoice/comments",
        "/reconciliation/supplier/reconciliation/details",
        "/reconciliation/supplier/currencies",
        "/reconciliation/supplier/currencies/conversionfactor",
        "/reconciliation/supplier/reconciliation/payment",
        "/reconciliation/supplier/invoice/payment",
        "/reconciliation/supplier/invoice/reconciliation",
        "/reconciliation/supplier/reconciliation/add",
        "/reconciliation/customer/ledger",
        "/reconciliation/customer/voucher",
        "/reconciliation/customer/list",
        "/reconciliation/customer/itinerary/list",
        "/reconciliation/customer/invoice",
        "/reconciliation/customer/invoice/validateinvoicenumber",
        "/reconciliation/customer/invoice",
        "/reconciliation/customer/invoice/list",
        "/reconciliation/customer/invoice",
        "/reconciliation/customer/invoice/itinerary/list",
        "/reconciliation/customer",
        "/reconciliation/supplier/invoice/report",
        "/reconciliation/supplier/payment/add",
        "/reconciliation/customer/invoice/booking/history",
        "/reconciliation/customer/invoice/payment/history",
        "/reconciliation/customer/invoice/payment/history/bookingrecords",
        "/reconciliation/customer/invoice/payment",
        "/reconciliation/customer/invoice/payment/brnlist",
        "/reconciliation/customer/invoice/payment/brn",
        "/reconciliation/customer/status",
        "/reconciliation/supplier/list",
        "/reconciliation/supplier/details",
        "/reconciliation/supplier/update",
        "/reconciliation/supplier/add",
        "/reconciliation/supplier/invoices/getbrnlist",
        "/reconciliation/supplier/ledger",
        "/reconciliation/supplier/lookup/country",
        "/reconciliation/supplier/lookup/state",
        "/reconciliation/supplier/lookup/city",
        "reconciliation/supplier/invoices/payment/add",
        "reconciliation/notes",
        "reconciliation/customer/additionalspayment",
        "reconciliation/customer/validate"
    ],
    "reports": [
        "/reports/outstanding",
        "/reports/sales",
        "/reports/revenue",
        "/reports/collection",
        "/reports/lead",
        "/reports/supplier",
        "/reports/supplierpayment",
        "/reports/booking",
    ],
    "cms": [
        "GET /cms/portal/details",
        "GET /cms/portal/menu",
        "GET /cms/portal/page",
        "GET /cms/htmlmodule",
        "GET /cms/deals",
        "GET /cms/packages",
        "GET /cms/lastminutedeals",
        "GET /cms/imageslider",
        "GET /cms/toplocations",
        "GET /cms/locationdetails",
        "GET /cms/specialpromotiondetails",
        "POST /cms/newsletter/add",
        "GET /cms/footermenu",
        "POST /cms/contact/add",
        "POST /cms/site/create",
        "POST /cms/portalalias/update",
        "POST /cms/package/add",
        "POST /cms/package/update",
        "POST /cms/package/delete",
        "GET /cms/package/getbyid",
        "GET /cms/package/getall",
        "GET /cms/package/getcurrency",
        "GET /cms/package/getcountry",
        "GET /cms/package/getcitybycountry",
        "POST /cms/Location/add",
        "POST /cms/location/update",
        "POST /cms/location/delete",
        "POST /cms/package/send",
        "POST /cms/portaltheme/update",
        "POST /cms/contact/send",
        "POST /cms/contactpartner/send",
        "POST /cms/newsletter/send",
        "POST /cms/page/newsletter/send",
        "GET /cms/marketplace/package/list",
        "POST /cms/inquirydetail/send",
        "GET /cms/htmlmodule/list",
        "GET /cms/htmlmodule/get",
        "POST /cms/htmlmodule/add",
        "POST /cms/htmlmodule/update",
        "POST /cms/htmlmodule/delete",
        "GET /cms/bannerimage/list",
        "GET /cms/bannerimage/get",
        "POST /cms/bannerimage/add",
        "POST /cms/bannerimage/update",
        "POST /cms/bannerimage/delete",
        "GET /cms/copyrights/get",
        "POST /cms/copyrights/update",
    ]
}