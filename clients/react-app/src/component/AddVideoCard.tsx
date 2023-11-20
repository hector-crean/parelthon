import { VideoForm } from "@/component/VideoForm";
import { Container, Flex, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconVideoPlus } from "@tabler/icons-react";
import styles from "./AddVideoCard.module.css";

interface AddVideoCardProps {
  refetchFn: Function;
}
const AddVideoCard = ({ refetchFn }: AddVideoCardProps) => {
  const [opened, { open, close }] = useDisclosure(false);

  const handleCloseModal = () => {
    close();
    refetchFn();
  };

  return (
    <>
      <Modal opened={opened} onClose={handleCloseModal}>
        {/* Modal content */}
        <VideoForm />
      </Modal>

      <Container className={styles.container}>
        <Flex
          onClick={open}
          style={{ height: "100%", width: "100%" }}
          direction={"column"}
          align={"center"}
          justify={"center"}
        >
          <IconVideoPlus />
        </Flex>
      </Container>
    </>
  );
};

export { AddVideoCard };
