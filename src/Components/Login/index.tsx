import React from "react";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import validator from "validator";
import Alert from "@material-ui/lab/Alert";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

type MessageType = {
  text: string;
  show: boolean;
  severity: "error" | "warning" | "info" | "success";
};

export default function Login() {
  const classes = useStyles();
  const history = useHistory();
  const [state, setState] = React.useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = React.useState<MessageType>({
    text: "",
    show: false,
    severity: "error",
  });

  function handleChange(evt: React.ChangeEvent<any>): void {
    setState({
      ...state,
      [evt.target.name]: evt.target.value,
    });
  }
  async function handleSubmit(evt: React.ChangeEvent<any>): Promise<any> {
    evt.preventDefault();
    if (validator.isEmail(state.email) && state.password.length > 1) {
      const rawResponse = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(state),
      });
      const content = await rawResponse.json();
      if (content.success) {
        setMessage({
          text: content.message,
          severity: "success",
          show: true,
        });

        localStorage.setItem("jwt_token", content.token);
        history.push("/");
      } else {
        setMessage({
          text: content.message,
          severity: "error",
          show: true,
        });
      }
    } else {
      setMessage({
        text: "Please fill valid email and password",
        severity: "error",
        show: true,
      });
      setTimeout(() => {
        setMessage({
          ...message,
          show: false,
        });
      }, 3000);
    }
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form className={classes.form}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            value={state.email}
            onChange={handleChange}
            autoComplete="email"
            autoFocus
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            value={state.password}
            onChange={handleChange}
            id="password"
            autoComplete="current-password"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={handleSubmit}
          >
            Sign In
          </Button>
        </form>
      </div>
      {message.show ? (
        <Alert severity={message.severity}>{message.text}</Alert>
      ) : null}
    </Container>
  );
}
