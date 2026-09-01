import { Head, useForm } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasskeyVerify from '@/components/passkey-verify';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { store } from '@/routes/login';
import { request } from '@/routes/password';
import AuthSimpleLayout from '@/layouts/auth/auth-simple-layout';
import type { ReactElement } from 'react';

type Props = {
    status?: string;
    canResetPassword: boolean;
};

function Login({ status, canResetPassword }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(store.url(), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
            <Head title="Log in" />

            <PasskeyVerify />

            <form onSubmit={submit} className="flex flex-col gap-6">
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label
                            htmlFor="email"
                            className="text-xs font-semibold text-muted-foreground"
                        >
                            Email
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="email"
                            placeholder="nama@email.com"
                        />
                        <InputError message={errors.email} />
                    </div>

                    <div className="grid gap-2">
                        <div className="flex items-center justify-between">
                            <Label
                                htmlFor="password"
                                className="text-xs font-semibold text-muted-foreground"
                            >
                                Password
                            </Label>
                            {canResetPassword && (
                                <TextLink
                                    href={request()}
                                    className="text-xs text-muted-foreground hover:text-foreground"
                                    tabIndex={5}
                                >
                                    Lupa password?
                                </TextLink>
                            )}
                        </div>
                        <PasswordInput
                            id="password"
                            name="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            required
                            tabIndex={2}
                            autoComplete="current-password"
                            placeholder="Password"
                        />
                        <InputError message={errors.password} />
                    </div>

                    <div className="flex items-center space-x-3">
                        <Checkbox
                            id="remember"
                            name="remember"
                            checked={data.remember}
                            onCheckedChange={(checked) => setData('remember', Boolean(checked))}
                            tabIndex={3}
                            className="rounded-full"
                        />
                        <Label htmlFor="remember" className="text-sm font-normal text-muted-foreground">
                            Ingat saya
                        </Label>
                    </div>

                    <Button
                        type="submit"
                        tabIndex={4}
                        disabled={processing}
                        data-test="login-button"
                    >
                        {processing && <Spinner />}
                        Masuk
                    </Button>
                </div>
            </form>

            {status && (
                <div className="mb-4 mt-4 text-center text-sm font-medium text-green-600">
                    {status}
                </div>
            )}
        </>
    );
}

Login.layout = (page: ReactElement) => (
    <AuthSimpleLayout
        title="Selamat datang kembali!"
        description="Masuk ke akun Anda untuk melanjutkan."
    >
        {page}
    </AuthSimpleLayout>
);

export default Login;