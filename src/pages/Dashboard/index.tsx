import { FC, useEffect, useState } from 'react';

import { Header } from '../../components/Header';
import api from '../../services/api';
import { Food } from '../../components/Food';
import { ModalAddFood } from '../../components/ModalAddFood';
import { ModalEditFood } from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';

type FoodData = {
  id: number;
  name: string;
  description: string;
  price: string;
  image: string;
}

type Food = {
  id: number;
  name: string;
  description: string;
  price: string;
  image: string;
  available: boolean;
}

export const Dashboard: FC = () => {
  const [foods, setFoods] = useState<Food[]>([]);
  const [editingFood, setEditingFood] = useState<FoodData>({} as FoodData);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);

  const handleAddFood = async (food: FoodData) => {
    try {
      const response = await api.post('/foods', {
        ...food,
        available: true,
      });

      setFoods(oldFoods => {
        return [...oldFoods, response.data];
      })
    } catch (err) {
      console.log(err);
    }
  }

  const handleUpdateFood = async (food: FoodData) => {
    try {
      const response = await api.put<Food>(
        `/foods/${editingFood.id}`,
        { ...editingFood, ...food },
      );

      const { id } = response.data;

      setFoods(oldFoods => {
        return oldFoods.map(food => food.id !== id ? food : response.data);
      });

    } catch (err) {
      console.log(err);
    }
  }

  const handleDeleteFood = async (id: number) => {
    await api.delete(`/foods/${id}`);

    setFoods(oldFoods => {
      return oldFoods.filter(food => food.id !== id);
    });
  }

  const toggleModal = () => {
    setModalOpen(oldModalOpen => !oldModalOpen);
  }

  const toggleEditModal = () => {
    setEditModalOpen(oldEditModalOpen => !oldEditModalOpen);
  }

  const handleEditFood = (food: FoodData) => {
    setEditingFood(food);
  }

  useEffect(() => {
    async function getFoods() {
      const response = await api.get('/foods');
      setFoods(response.data);
    }

    getFoods();
  }, []);

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
}
