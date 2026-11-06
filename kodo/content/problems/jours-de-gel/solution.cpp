#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    // Le compteur commence à 0, avant la boucle.
    int gel = 0;
    for (int i = 0; i < n; i++) {
        int t;
        cin >> t;
        if (t < 0) {
            gel = gel + 1;
        }
    }
    cout << gel << "\n";
    return 0;
}
