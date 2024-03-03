import { UserRole } from '@/hooks/useLogin'
export interface MenuItemProps {
  type?: "group" | "link" | "divider"
  title?: string
  icon?: string | any
  path?: string
  disabled?: boolean
  children?: any
}

export const SideMenu = (role?: UserRole) => {

  const deleloperMenu = {

    "test":{
      "title":"Develop Tests",
      "path":"/test",
      "children":{
        "testPage": { "title": "Test", "path": "/test" },
      }
    },
    "ui-elements": {
      "title": "UI Elements",
      "icon": "fa-solid fa-building-wheat",
      "path": "/ui",
      "children": {
        "alerts": { "title": "Alerts", "path": "/ui/alerts" },
        "buttons": { "title": "Buttons", "path": "/ui/buttons" }
      }
    },
    "forms": {
      "title": "Forms",
      "icon": "fa-regular fa-rectangle-list",
      "path": "/forms",
      "children": {
        "form-elements": { "title": "Form Elements", "path": "/forms/form-elements" },
        "form-layout": { "title": "Form Layout", "path": "/forms/form-layout" }
      }
    },
    "calendar": { "title": "Calendar", "path": "/calendar", "icon": "fa-solid fa-calendar-days" },
    "tables": { "title": "Tables", "path": "/tables", "icon": "fa-solid fa-table-cells" },
    "profile": { "title": "Profile", "path": "/profile", "icon": "fa-regular fa-address-card" }
  }
  const adminMenu: any = {
    "dashboard": {
      "title": "Dashboard",
      "icon": "fa-solid fa-gauge",
      "path": "/dashboard",
      "children": {
        "general": { "title": "Genel", "path": "/dashboard", "icon": "fa-solid fa-chart-column" },
        "daily": { "title": "Günlük", "disable": true, "icon": "fa-solid fa-chart-column" }
      }
    },
    "tours": {
      "title": "Tour operations", "path": "/tours", "icon": "fa-solid fa-earth-asia",
      "children": {
        "agencyOp": { "title": "Acency Orders", "path":"/agencyOrders", "icon": "fa-solid fa-handshake" },
        "sales": { "title": "Sales", "disable": true, "icon": "fa-solid fa-cash-register" },
        "tourExpeditions": { "title": "Tour Expeditions", "path":"/tourExpeditions", "icon": "fa-solid fa-route" }
      }
    },
    "defs": {
      "title": "Definitions", "path": "/defs", "icon": "fa-solid fa-list-check",
      "children": {
        "tours": { "title": "Tour definitions", "path": "/tours", "icon": "fa-solid fa-route" },
        "locations": { "title": "Locations", "path": "/locations", "icon": "fa-solid fa-mountain-city" },
        "accommodations": { "title": "Hotels", "path": "/accommodations", "icon": "fa-solid fa-hotel" },
        "destinations": { "title": "Destinations", "path": "/destinations", "icon": "fa-solid fa-map-location-dot" },
      }
    },
    "users": { "title": "Kullanicilar", "path": "/users", "icon": "fa-solid fa-users" },
    "divider1": "---",
    "settings": { "title": "Ayarlar", "path": "/settings", "icon": "fa-solid fa-screwdriver-wrench" }
  }

  const managerMenu: any = {
    "dashboard": {
      "title": "Dashboard",
      "icon": "fa-solid fa-gauge",
      "path": "/tables"
    },
    "ui-elements": {
      "title": "UI Elements",
      "icon": "fa-solid fa-building-wheat",
      "path": "/ui",
      "children": {
        "alerts": { "title": "Alerts", "path": "/ui/alerts" },
        "buttons": { "title": "Buttons", "path": "/ui/buttons" }
      }
    },
    "forms": {
      "title": "Forms",
      "icon": "fa-regular fa-rectangle-list",
      "path": "/forms",
      "children": {
        "form-elements": { "title": "Form Elements", "path": "/forms/form-elements" },
        "form-layout": { "title": "Form Layout", "path": "/forms/form-layout" }
      }
    },
    "calendar": { "title": "Calendar", "path": "/calendar", "icon": "fa-solid fa-calendar-days" },
    "tables": { "title": "Tables", "path": "/tables", "icon": "fa-solid fa-table-cells" },
  }
  if (role === UserRole.DEVELOPER) {
    return Object.assign({}, adminMenu, deleloperMenu)
  } else if (role === UserRole.ADMIN) {
    return adminMenu
  } else if (role === UserRole.MANAGER) {
    return managerMenu
  } else {
    return null
  }

}

export default SideMenu