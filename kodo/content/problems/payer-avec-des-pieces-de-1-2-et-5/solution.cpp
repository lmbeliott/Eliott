#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;

    // Le total dépasse 2 milliards pour les grands N : long long.
    long long total = 0;
    // A est le nombre de pièces de 5.
    for (int a = 0; a <= n / 5; a++) {
        int reste = n - 5 * a;
        // Pour payer le reste avec des 2 et des 1 : de 0 à reste / 2 pièces de 2.
        total = total + reste / 2 + 1;
    }

    cout << total << "\n";
    return 0;
}
