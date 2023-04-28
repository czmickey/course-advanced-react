import Form from './styles/Form';
import useForm from '../lib/useForm';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';
import Error from './ErrorMessage';

const RESET_MUTATION = gql`
    mutation RESET_MUTATION(
        $email: String!,
        $password: String!,
        $token: String!
    ) {
        redeemUserPasswordResetToken(
            email: $email,
            password: $password,
            token: $token,
        ) {
            code
            message
        }
    }
`

export default function Reset({ token }) {
    const { inputs, handleChange, resetForm } = useForm({ 
        email: '', 
        password: '',
        token
    });
    const [reset, { data, loading }] = useMutation(RESET_MUTATION, {
        variables: inputs,
    })

    const error = data?.redeemUserPasswordResetToken?.code
        ? data?.redeemUserPasswordResetToken
        : undefined;
    console.log(error);

    async function handleSubmit(e) {
        e.preventDefault(); // stop the form from submitting
        console.log(inputs);
        const res = await reset().catch(console.error);
        console.log(res);
        console.log({ data, loading, error })
        resetForm();
    }

    return (
        <Form method='POST' onSubmit={handleSubmit}>
            <h2>Reset Your Password</h2>
            <Error error={error} />
            <fieldset>
                {data?.redeemUserPasswordResetToken === null && (
                    <p>Success! You can now sign in!</p>
                )}
                <label htmlFor="email">
                    Email
                    <input 
                        type="email" 
                        name="email" 
                        placeholder='Your Email Address'
                        autoComplete='email'
                        value={inputs.email}
                        onChange={handleChange}
                    />
                </label>
                <label htmlFor="password">
                    Password
                    <input 
                        type="password" 
                        name="password" 
                        placeholder='Password'
                        autoComplete='password'
                        value={inputs.password}
                        onChange={handleChange}
                    />
                </label>
                <button type="submit">Request Reset!</button>
            </fieldset>
        </Form>
    );
}