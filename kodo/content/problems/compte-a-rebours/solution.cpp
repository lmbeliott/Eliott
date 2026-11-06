#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    // On compte de n jusqu'à 1.
    for (int i = n; i >= 1; i--) {
        cout << i << "\n";
    }
    // Après la boucle : une seule fois.
    cout << "PARTEZ\n";
    return 0;
}
