type subscribeInfoType = {
  id: number,
  plan: string | null,
  oneMealGramsPerRecipe: string,
  recipeName: string
}

type propsType = {
  before: subscribeInfoType,
  after: subscribeInfoType
}

export const isChangedSubscribeInformation = ({before, after}:propsType) => {
  
  let result = true;
  
  if(!before || !after) {
    result = false;
  } else if (!before.id || !before.plan || !before.recipeName || !before.oneMealGramsPerRecipe) {
    result = false;
  } else if ((before.plan === after.plan) && (before.oneMealGramsPerRecipe === after.oneMealGramsPerRecipe) && (before.recipeName === after.recipeName)) {
    result = false;
  }
  
  
  return result;
  
};
