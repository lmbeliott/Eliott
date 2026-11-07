#include <cmath>
#include <iostream>
using namespace std;

int main() {
    long long n;
    cin >> n;

    // k = partie entière de la racine carrée de n
    long long k = (long long)sqrt((double)n);
    while ((k + 1) * (k + 1) <= n) {
        k++;
    }
    while (k * k > n) {
        k--;
    }

    long long a_petit = 0;    // nombre de couples avec a <= k
    for (long long a = 1; a <= k; a++) {
        a_petit += n / a;
    }
    cout << 2 * a_petit - k * k << "\n";
    return 0;
}
