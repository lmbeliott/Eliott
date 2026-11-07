#include <iostream>
using namespace std;

long long pgcd(long long a, long long b) {
    while (b != 0) {
        long long r = a % b;
        a = b;
        b = r;
    }
    return a;
}

// somme des multiples de d entre 1 et n
long long somme_multiples(long long d, long long n) {
    long long k = n / d;
    return d * (k * (k + 1) / 2);
}

int main() {
    long long n, a, b;
    cin >> n >> a >> b;
    long long ppcm = a / pgcd(a, b) * b;
    cout << somme_multiples(a, n) + somme_multiples(b, n) - somme_multiples(ppcm, n) << "\n";
    return 0;
}
