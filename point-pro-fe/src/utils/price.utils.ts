import { IOrder, ICartItem, GetMenuResponseSpecialtyItem } from '~/types';

export const calculateSpecialtiesPrice = (selectedSpecialtyItems: GetMenuResponseSpecialtyItem[]) => {
  const specialtiesPrice = selectedSpecialtyItems.reduce((acc, specialtyItem) => {
    return (acc += specialtyItem.price);
  }, 0);

  return specialtiesPrice;
};

export const calculateCartItemPrice = (cartItem: ICartItem) => {
  const selectedSpecialtyItemsPrice = calculateSpecialtiesPrice(cartItem.selectedSpecialtyItems);
  const cartItemPrice = (cartItem.price + selectedSpecialtyItemsPrice) * cartItem.amount;

  return cartItemPrice;
};

export const calculateCartPrice = (cart: ICartItem[]) => {
  const cartPrice = cart.reduce((acc, cartItem) => (acc += calculateCartItemPrice(cartItem)), 0);

  return cartPrice;
};

// TODO
// export const calculateOrderPrice = (order: IOrder) => {
//   const { orderMeals = [] } = order;
//   const orderPrice = orderMeals.reduce((acc, orderMeal) => (acc += orderMeal.price), 0);

//   return orderPrice;
// };

// export const calculateGatherOrderPrice = (gatherOrder: GatherOrder) => {
//   const { orders } = gatherOrder;
//   const gatherOrderPrice = orders.reduce((acc, order) => {
//     return acc + calculateOrderPrice(order);
//   }, 0);

//   return gatherOrderPrice;
// };
