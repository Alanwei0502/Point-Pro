import { ICartItem, MenuSpecialtyItem, OrderMealInOrdersResult } from '~/types';

export const calculateSpecialtiesPrice = (selectedSpecialtyItems: MenuSpecialtyItem[]) => {
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

export const calculateOrderPrice = (orderMeal: OrderMealInOrdersResult) => {
  const { meals, orderMealSpecialtyItems } = orderMeal;
  const mealPrice = meals.price;
  const specialtiresPrice = orderMealSpecialtyItems.reduce((acc, si) => (acc += si.specialtyItems.price), 0);
  const orderPrice = mealPrice + specialtiresPrice;
  return orderPrice;
};
