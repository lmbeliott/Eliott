#include <iostream>
#include <vector>
using namespace std;

int main() {
    const long long LIMITE = 1000000000000000000LL;

    // tous les entiers 2^a * 3^b au plus égaux à 10^18
    vector<long long> nombres;
    for (long long p = 1; p <= LIMITE; p = p * 2) {
        for (long long x = p; x <= LIMITE; x = x * 3) {
            nombres.push_back(x);
        }
    }

    int q;
    cin >> q;
    for (int i = 0; i < q; i++) {
        long long a, b;
        cin >> a >> b;
        int compte = 0;
        for (long long x : nombres) {
            if (a <= x && x <= b) {
                compte++;
            }
        }
        cout << compte << "\n";
    }
    return 0;
}
