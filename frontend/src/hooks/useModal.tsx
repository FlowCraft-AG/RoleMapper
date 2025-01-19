import { useCallback, useState } from 'react';

/**
 * Hook zur Verwaltung des Öffnungs- und Schließstatus von Modalen.
 * Unterstützt mehrere Modale mit einem Identifier.
 */
export function useModal() {
  const [openModals, setOpenModals] = useState<Record<string, boolean>>({});

  /**
   * Öffnet ein Modal mit einer eindeutigen ID.
   * @param id Die ID des Modals
   */
  const openModal = useCallback((id: string) => {
    setOpenModals((prev) => ({ ...prev, [id]: true }));
  }, []);

  /**
   * Schließt ein Modal mit einer eindeutigen ID.
   * @param id Die ID des Modals
   */
  const closeModal = useCallback((id: string) => {
    setOpenModals((prev) => ({ ...prev, [id]: false }));
  }, []);

  /**
   * Umschalten eines Modals mit einer eindeutigen ID (öffnen/schließen).
   * @param id Die ID des Modals
   */
  const toggleModal = useCallback((id: string) => {
    setOpenModals((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  /**
   * Überprüft, ob ein bestimmtes Modal geöffnet ist.
   * @param id Die ID des Modals
   * @returns True, wenn das Modal geöffnet ist
   */
  const isOpen = useCallback((id: string) => !!openModals[id], [openModals]);

  return {
    isOpen,
    openModal,
    closeModal,
    toggleModal,
  };
}
