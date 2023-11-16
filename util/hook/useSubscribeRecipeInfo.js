import {useEffect, useState} from "react";
import {getData} from "../../src/pages/api/reqData";

export const useSubscribeRecipeInfo = () => {
  const [recipeData, setRecipeData] = useState( null );
  const [loading, setLoading] = useState( false );
  
  useEffect( () => {
    (async () => {
      try {
        setLoading( true );
        // insert async & await code
        if ( recipeData ) return;
        const getAllRecipeInfoUrl = '/api/recipes';
        const res = await getData( getAllRecipeInfoUrl );
        // // console.log(res);
        const data = res.data?._embedded.recipeListResponseDtoList;
        if ( data ) {
          const DATA = data.map( d => ({
            id: d.id,
            name: d.name,
            description: d.description,
            pricePerGram: d.pricePerGram,
            kcalPerGram: d.gramPerKcal, // ! 단위: gramPerKcal(X) / kcalPerGram(O)
            ingredients: d.ingredients,
            leaked: d.leaked,
            inStock: d.inStock,
          }) )
          setRecipeData( DATA );
        }
      } catch (err) {
        console.error( err );
      } finally {
        setLoading( false );
      }
    })();
  }, [] )
  
  
  return {
    data: recipeData,
    loading: loading
  };
};
