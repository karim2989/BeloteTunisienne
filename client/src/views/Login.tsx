import { RequestConnect } from "../Client";

export function Login() {
    return (
        <div className="login-container">
            <form className="login-form" onSubmit={(e) => {
                e.preventDefault();
                ///@ts-expect-error
                let username = e.target.username.value;
                ///@ts-expect-error
                let password = e.target.password.value;
                RequestConnect(username, password);
            }}>
                <h2>Login</h2>
                <div className="form-group">
                    <label htmlFor="username">Username:<sup>[1]</sup></label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:<sup>[2]</sup></label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                    />
                </div>
                <button type="submit">Login</button><br />
                <sup>[1]</sup> <small>required</small><br />
                <sup>[2]</sup> <small>optional</small><br />
            </form>
        </div>
    );
};

export default Login;