export const redirectToDashboard = (navigate, userRole) => {
  let target = "/restaurants/home";

  switch (userRole) {
    case "Admin":
      target = "/admin-users";
      break;
    case "RestaurantOwner":
      target = "/restaurants/dashboard";
      break;
    case "RestaurantEmployee":
      target = "/employee/dashboard";
      break;
    case "DeliveryPerson":
      target = "/delivery/dashboard";
      break;
  }

  // If navigate is provided, perform navigation
  if (typeof navigate === "function") {
    navigate(target, { replace: true });
  }

  // Always return the path (useful for comparisons)
  return target;
};
