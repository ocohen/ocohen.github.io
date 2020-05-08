dft = function(f, k)
{
    //X_k = 1/N \sum x_n e^(-i2pi kn/N) n \in [0,N-1]
    let N = f.length;

    let real = 0;
    let imaginary = 0;
    let scalar = -2*Math.PI*k/(N);

    for(let n=0; n<= N-1; n++)
    {
        real += f[n][1] * Math.cos(scalar*n);
        imaginary += f[n][1] * Math.sin(scalar*n);
    }

    return [real/N,imaginary/N];
}

get_halfN = function(N)
{
    let halfN = 0;
    let oddN = (N%2) != 0;
    if(oddN)
    {
        halfN = (N-1)/2;
    }
    else
    {
        halfN = N/2;
    }

    return [halfN, oddN];
}

get_coefficient = function(xs, k, halfN, oddN)
{
    let X_k_r;
    let X_k_i;
    if(k == -halfN || k == halfN)
    {
        if(oddN)
        {
            if(k < 0)
            {
                X_k_r = xs[N+k][0];
                X_k_i = xs[N+k][1];
            }
            else
            {
                X_k_r = xs[k][0];
                X_k_i = xs[k][1];
            }
        }
        else
        {
            X_k_r = xs[halfN][0] * 0.5;
            X_k_i = xs[halfN][1] * 0.5;
        }
    }
    else if(k < 0)
    {
        X_k_r = xs[N+k][0];
        X_k_i = xs[N+k][1];
    }
    else
    {
        X_k_r = xs[k][0];
        X_k_i = xs[k][1];
    }

    return [X_k_r, X_k_i];
}

idft = function(xs, n)
{
    //x_n = \sum XX_k e(i2pi kn/N) k \in [-N/2,N/2]
    let N = xs.length;
    let half_info = get_halfN(N);
    let halfN = half_info[0];
    let oddN = half_info[1];

    let real = 0;
    let imaginary = 0;
    let scalar = 2*Math.PI*n/(N);

    for(let k=-halfN; k<= halfN; k++)
    {
        let X_k = get_coefficient(xs, k, halfN, oddN);
        let r = Math.cos(scalar*k);
        let i = Math.sin(scalar*k);
        real += X_k[0] * r - X_k[1] * i;
        imaginary += X_k[0] * i + X_k[1] * r;
    }

    return [real,imaginary];
}

idft2 = function(xs, n)
{
    //x_n = \sum X_k e(i2pi kn/N) k \in [0,N-1]
    //i2pixn/N vs i2pix(N-r)/N = i2pixN/N -i2pixr/N
    //the first term is not 1 because x is not an integer!
    let N = xs.length;

    let real = 0;
    let imaginary = 0;
    let scalar = 2*Math.PI*n/N;
    let reals = [];
    let imags = [];

    for(let k=0; k<= N-1; k++)
    {
        let X_k_r;
        let X_k_i;
        X_k_r = xs[k][0];
        X_k_i = xs[k][1];

        let r = Math.cos(scalar*k);
        let i = Math.sin(scalar*k);
        reals[k] = r;
        imags[k] = i;
        real += X_k_r * r - X_k_i * i;
        imaginary += X_k_r * i + X_k_i * r;
    }

    return [real,imaginary];
}

//discretize a function
discretize = function(f, n, end)
{
    let results = [];
    let dx = end / (n-1);
    for(i=0; i<n-1; i++)
    {
        results.push([dx*i, f(dx*i)]);
    }
    results.push([end, f(end)]);
    return results;
}
