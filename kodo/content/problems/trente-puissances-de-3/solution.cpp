#include <iostream>
using namespace std;

int main() {
    long long p = 1;  // 3 puissance 0 ; long long car 3^29 dépasse un int
    for (int k = 0; k < 30; k++) {
        cout << k << " " << p << "\n";
        // La puissance suivante est le triple de la précédente.
        p = p * 3;
    }
    return 0;
}
