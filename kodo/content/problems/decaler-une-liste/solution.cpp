#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n, k;
    cin >> n >> k;
    vector<int> liste(n);
    for (int i = 0; i < n; i++) {
        cin >> liste[i];
    }

    // Un décalage de N ramène la liste à son point de départ.
    k = k % n;

    // La case i de la liste décalée vient de la case (i + k) % n.
    for (int i = 0; i < n; i++) {
        cout << liste[(i + k) % n] << " ";
    }
    cout << "\n";
    return 0;
}
