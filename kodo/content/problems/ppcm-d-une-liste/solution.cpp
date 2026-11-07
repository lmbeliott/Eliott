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

int main() {
    const long long LIMITE = 1000000000000000000LL;
    int n;
    cin >> n;
    long long ppcm = 1;
    bool trop = false;
    for (int i = 0; i < n; i++) {
        long long b;
        cin >> b;
        if (trop) {
            continue;
        }
        long long q = ppcm / pgcd(ppcm, b);
        if (q > LIMITE / b) {        // q × b dépasserait 10^18
            trop = true;
        } else {
            ppcm = q * b;
        }
    }
    cout << (trop ? -1 : ppcm) << "\n";
    return 0;
}
