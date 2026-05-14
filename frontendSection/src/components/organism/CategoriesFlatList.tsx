import React from 'react';
import { FlatList, View } from 'react-native';
import CircularImageCard from '@src/components/molecule/CircularImageCard';
import CategorySkeleton from '@src/pages/tabs/HomeTab/Home/components/CategorySkeleton';

interface CategoriesFlatListProps {
  categories: any[];
  loading: boolean;
  categoryFlatList: any;
}

const CategoriesFlatList = ({ categories, loading, categoryFlatList }: CategoriesFlatListProps) => {
  return (
    <View>
      {loading ? (
        <CategorySkeleton />
      ) : (
        <FlatList
          data={categories}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <CircularImageCard
              imageUri={item.image}
              size={70}
              containerStyles={categoryFlatList}
            />
          )}
          contentContainerStyle={categoryFlatList}
          snapToInterval={82}
          snapToAlignment="start"
          decelerationRate="fast"
          disableIntervalMomentum={true}
        />
      )}
    </View>
  );
};

export default CategoriesFlatList;
