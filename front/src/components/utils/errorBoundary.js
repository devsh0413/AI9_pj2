import { useNavigate } from "react-router-dom";
import { Container, Button } from 'react-bootstrap';


export default function ErrorFallBack ({ error, resetErrorBoundary }) {
    const navigate = useNavigate();

    const handleHomeClick = () => {
        navigate('/');
        resetErrorBoundary();
    }

    return (
      <>
        <Container className="d-flex justify-content-center align-items-center" style={{ height: "500px"}}>
            <div>
                <p>죄송합니다</p>
                <p>오류가 발생했습니다</p>
                <Button variant="dark" onClick={handleHomeClick}>홈으로 돌아가기</Button>
                <Button variant="dark" onClick={resetErrorBoundary}>이전 화면으로 돌아가기</Button>
            </div>
        </Container>
      </>
    );
  }