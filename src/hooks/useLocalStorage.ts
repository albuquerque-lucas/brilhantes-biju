import { useState, useEffect } from 'react';

type UseLocalStorageReturn<T> = [T, (value: T | ((val: T) => T)) => void];

/**
 * Hook personalizado para persistir dados no localStorage
 * @param key Chave para armazenamento no localStorage
 * @param initialValue Valor inicial caso não exista no localStorage
 * @returns [storedValue, setValue] - Valor armazenado e função para atualizá-lo
 */
function useLocalStorage<T>(key: string, initialValue: T): UseLocalStorageReturn<T> {
  // Estado para armazenar o valor
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      // Obter do localStorage pelo key
      const item = window.localStorage.getItem(key);
      // Analisar o item armazenado ou retornar initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // Se ocorrer erro, retornar initialValue
      console.error(`Erro ao recuperar ${key} do localStorage:`, error);
      return initialValue;
    }
  });

  // Função para atualizar o valor no localStorage
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Permitir que o valor seja uma função para seguir o mesmo padrão do useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      // Salvar estado
      setStoredValue(valueToStore);
      // Salvar no localStorage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Erro ao salvar ${key} no localStorage:`, error);
    }
  };

  return [storedValue, setValue];
}

export default useLocalStorage;
